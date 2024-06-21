"use client";
import { deleteNote } from "@/models/note.server";
import { useRequiredAuth } from "@/providers/auth-provider";
import { Note } from "@prisma/client";
import { useRouter } from "next/navigation";

export const NoteDetail = ({ data }: { data: Note }) => {
  const { user } = useRequiredAuth();
  const router = useRouter();
  const handleDelete = async () => {
    await deleteNote({ id: data.id, userId: user.id });
    router.push("/notes");
  };

  if (!data) return "not found";
  return (
    <div>
      <h3 className="text-2xl font-bold">{data.title}</h3>
      <p className="py-6">{data.body}</p>

      <hr className="my-4" />
      <form action={handleDelete}>
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </form>
    </div>
  );
};
