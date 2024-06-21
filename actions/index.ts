"use server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { auth, lucia } from "@/lib/auth";
import { redirect } from "next/navigation";
import { generateIdFromEntropySize } from "lucia";
import { ActionResult } from "@/types";
import { hash, compare } from "bcryptjs";
import { createUser } from "@/models/user.server";
import { DefaultRedirect } from "@/contants";
import { safeRedirect } from "@/lib/utils";

export async function signup(
  formData: FormData
): Promise<ActionResult<Partial<Record<"username" | "password", string>>>> {
  "use server";
  const username = formData.get("username");
  // username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
  // keep in mind some database (e.g. mysql) are case insensitive
  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return {
      error: {
        username: "Invalid username",
      },
    };
  }
  const password = formData.get("password");
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: { password: "Invalid password" },
    };
  }
  const userExist = await db.user.findFirst({ where: { username } });
  if (userExist) return { error: { username: "User đã tồn tại" } };
  const passwordHash = await hash(password, 10);
  const userId = generateIdFromEntropySize(10); // 16 characters long

  // TODO: check if username is already used

  await createUser({
    id: userId,
    username,
    password_hash: passwordHash,
    github_id: null,
  });

  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect(DefaultRedirect);
}

export async function login(
  formData: FormData
): Promise<
  ActionResult<Partial<Record<"username" | "password" | "all", string>>>
> {
  "use server";
  const username = formData.get("username");
  if (
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return {
      error: { username: "Invalid username" },
    };
  }
  const password = formData.get("password");
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: { password: "Invalid password" },
    };
  }

  const existingUser = await db.user.findFirst({ where: { username } });
  if (!existingUser || (existingUser && !existingUser.password_hash)) {
    // NOTE:
    // Returning immediately allows malicious actors to figure out valid usernames from response times,
    // allowing them to only focus on guessing passwords in brute-force attacks.
    // As a preventive measure, you may want to hash passwords even for invalid usernames.
    // However, valid usernames can be already be revealed with the signup page among other methods.
    // It will also be much more resource intensive.
    // Since protecting against this is non-trivial,
    // it is crucial your implementation is protected against brute-force attacks with login throttling etc.
    // If usernames are public, you may outright tell the user that the username is invalid.
    return {
      error: { all: "Incorrect username or password" },
    };
  }

  const validPassword = await compare(password, existingUser.password_hash!);
  if (!validPassword) {
    return {
      error: { all: "Incorrect username or password" },
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  const redirectTo = formData.get("redirectTo") as string;
  return redirectTo
    ? redirect(safeRedirect(redirectTo))
    : redirect(DefaultRedirect);
}
export async function logout() {
  const { session } = await auth();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/login");
}
