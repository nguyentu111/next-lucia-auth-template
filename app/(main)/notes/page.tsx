import { auth, requiredAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Notes({ params }: any) {
  const { user, session } = await requiredAuth();
  return <h1>Hi, {user.username}!</h1>;
}
