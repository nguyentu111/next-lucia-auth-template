"use client";

import { UserWithoutPass } from "@/types";
import { Session } from "lucia";
import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextValue {
  user: UserWithoutPass | null;
  session: Session | null;
  setUser: (user: UserWithoutPass | null) => void;
  setSession: (session: Session | null) => void;
}

interface RequiredAuth extends AuthContextValue {
  user: UserWithoutPass;
  session: Session;
}

const authContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  setUser: (user: UserWithoutPass | null) => {
    console.warn("setUser called without a provider.");
  },
  setSession: (session: Session | null) => {
    console.warn("setSession called without a provider.");
  },
});

export const AuthProvider = ({
  children,
  session = null,
  user = null,
}: {
  children: ReactNode;
  user?: UserWithoutPass | null;
  session?: Session | null;
}) => {
  const [userState, setUser] = useState<UserWithoutPass | null>(user);
  const [sessionState, setSession] = useState<Session | null>(session);

  return (
    <authContext.Provider
      value={{ user: userState, session: sessionState, setUser, setSession }}
    >
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(authContext);

export const useRequiredAuth = (): RequiredAuth => {
  const { user, session, ...rest } = useAuth();
  if (!user || !session) throw new Error("Error: Unauthenticated");
  return { user, session, ...rest };
};
