import { db } from "@/lib/db";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function GET(req: NextRequest) {
  return Response.json(await db.note.findMany());
}
