"use server";

import type { User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return db.user.findUnique({ where: { id } });
}

export async function getUserByEmail(username: User["username"]) {
  return db.user.findUnique({ where: { username } });
}

export async function createUser(data: User) {
  return await db.user.create({
    data,
  });
}

export async function getUserByUsername(username: User["username"]) {
  return db.user.delete({ where: { username } });
}
