"use client";
import { deleteNote } from "@/models/note.server";
import { UserWithoutPass } from "@/types";
import { Note, User } from "@prisma/client";
import { headers } from "next/headers";
import { useRouter } from "next/navigation";

export const NoteDetail = ({
  data,
  user,
}: {
  data: Note;
  user: UserWithoutPass;
}) => {
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
