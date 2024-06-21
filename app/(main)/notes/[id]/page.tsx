import { auth, requiredAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NoteDetail } from "./_components/detail";

export default async function page({ params }: any) {
  const { user } = await requiredAuth();
  const data = await db.note.findFirst({
    where: { userId: user.id, id: params.id },
  });
  if (!data) return "not found";
  return <NoteDetail data={data} />;
}
