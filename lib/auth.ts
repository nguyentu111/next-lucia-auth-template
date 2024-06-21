import { Lucia, Session, User as LuciaUser } from "lucia";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";

import { User } from "@prisma/client";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserWithoutPass } from "@/types";
import { GitHub } from "arctic";
import { LoginUrl, LuciaSessionName } from "@/contants";
import { db } from "./db";
export const github = (redirectURI?: string) =>
  new GitHub(
    process.env.GITHUB_CLIENT_ID as string,
    process.env.GITHUB_CLIENT_SECRET as string,
    { redirectURI }
  );
const adapter = new PrismaAdapter(db.session, db.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: LuciaSessionName,
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    const user = attributes as unknown as User;
    return {
      // attributes has the type of DatabaseUserAttributes
      username: user.username,
      id: user.id,
      githubId: attributes.github_id,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  username: string;
  github_id?: number;
}

export const auth = cache(
  async (): Promise<
    { user: UserWithoutPass; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }
    const result = await lucia.validateSession(sessionId);
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch {}
    return result;
  }
);
export const requiredAuth = async (redirectTo?: string) => {
  const { user, session } = await auth();
  if (!user || !session)
    redirect(`${LoginUrl}${redirectTo ? `?redirectTo=${redirectTo}` : ""}`);
  else return { user, session };
};
