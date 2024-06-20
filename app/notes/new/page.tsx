import AddNoteForm from "./_components/form";
import { requiredAuth } from "@/lib/auth";

export default async function page() {
  const { user } = await requiredAuth();
  return <AddNoteForm userId={user.id} />;
}
