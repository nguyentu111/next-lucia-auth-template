import { db } from "@/lib/db";
import { github, lucia } from "@/lib/auth";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { parseCookies } from "oslo/cookie";
import { type NextRequest } from "next/server";
import { safeRedirect } from "@/lib/utils";
export async function GET(request: NextRequest) {
  const cookies = parseCookies(request.headers.get("Cookie") ?? "");
  const stateCookie = cookies.get("github_oauth_state") ?? null;
  const redirect = safeRedirect(cookies.get("redirect"));
  const url = new URL(request.url);
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");

  // verify state
  if (!state || !stateCookie || !code || stateCookie !== state) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await github().validateAuthorizationCode(code);
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubUserResult: GitHubUserResult = await githubUserResponse.json();

    const existingUser = await db.user.findFirst({
      where: {
        github_id: githubUserResult.id,
      },
    });
    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      console.log("serialize: ", sessionCookie.serialize());
      return new Response(null, {
        status: 302,
        headers: {
          Location: redirect,
          "Set-Cookie": sessionCookie.serialize(),
        },
      });
    }

    const userId = generateIdFromEntropySize(10); // 16 characters long
    await db.user.create({
      data: {
        id: userId,
        username: githubUserResult.login,
        github_id: githubUserResult.id,
      },
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    return new Response(null, {
      status: 302,
      headers: {
        Location: redirect,
        "Set-Cookie": sessionCookie.serialize(),
      },
    });
  } catch (e) {
    console.log(e);
    if (e instanceof OAuth2RequestError) {
      // bad verification code, invalid credentials, etc
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}
interface GitHubUserResult {
  id: number;
  login: string; // username
}
