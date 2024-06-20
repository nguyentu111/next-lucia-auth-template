"use server";
import { db } from "@/lib/db";
import type { User, Note } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getNote({
  id,
  userId,
}: Pick<Note, "id"> & {
  userId: User["id"];
}) {
  return db.note.findFirst({
    select: { id: true, body: true, title: true },
    where: { id, userId },
  });
}

export async function getNoteListItems({ userId }: { userId: User["id"] }) {
  return db.note.findMany({
    where: { userId },
    select: { id: true, title: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createNote({
  body,
  title,
  userId,
}: Pick<Note, "body" | "title"> & {
  userId: User["id"];
}) {
  const note = await db.note.create({
    data: {
      title,
      body,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
  revalidatePath("/notes");
  return note;
}

export async function deleteNote({
  id,
  userId,
}: Pick<Note, "id"> & { userId: User["id"] }) {
  const rs = db.note.deleteMany({
    where: { id, userId },
  });
  revalidatePath("/notes");
  return rs;
}
