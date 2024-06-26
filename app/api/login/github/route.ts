import { github } from "@/lib/auth";
import { generateState } from "arctic";
import { serializeCookie } from "oslo/cookie";
import { type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { safeRedirect } from "@/lib/utils";
import { RedirectSearchKey } from "@/contants";
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const redirect = safeRedirect(searchParams.get(RedirectSearchKey));
  cookies().set(RedirectSearchKey, redirect);
  const state = generateState();
  const url = await github().createAuthorizationURL(state);
  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString(),
      "Set-Cookie": serializeCookie("github_oauth_state", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // set `Secure` flag in HTTPS
        maxAge: 60 * 10, // 10 minutes
        path: "/",
      }),
    },
  });
}
