import { logout } from "@/actions";
import { requiredAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";

export default async function NotesLayout({ children }: any) {
  const { user } = await requiredAuth("/notes");
  const data = await db.note.findMany({ where: { userId: user.id } });
  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link href="/notes">Notes</Link>
        </h1>
        <p>{user.username}</p>
        <form action={logout}>
          <button
            type="submit"
            className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </form>
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link href="/notes/new" className="block p-4 text-xl text-blue-500">
            + New Note
          </Link>

          <hr />

          {data.length === 0 ? (
            <p className="p-4">No notes yet</p>
          ) : (
            <ol>
              {data.map((note) => (
                <li key={note.id}>
                  <Link
                    className={`block border-b p-4 text-xl`}
                    href={`/notes/${note.id}`}
                  >
                    📝 {note.title}
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  );
}
