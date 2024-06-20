"use client";

import { createNote } from "@/models/note.server";
import { useRouter } from "next/navigation";

export default function AddNoteForm({ userId }: { userId: string }) {
  const router = useRouter();
  const handleAdd = async (data: FormData) => {
    const rs = await createNote({
      body: data.get("body") as string,
      title: data.get("title") as string,
      userId,
    });
    router.push(`/notes/${rs.id}`);
  };
  return (
    <form
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
      action={handleAdd}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Title: </span>
          <input
            //   ref={titleRef}
            name="title"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            //   aria-invalid={actionData?.errors?.title ? true : undefined}
            //   aria-errormessage={
            //     actionData?.errors?.title ? "title-error" : undefined
            //   }
          />
        </label>
        {/* {actionData?.errors?.title ? (
        <div className="pt-1 text-red-700" id="title-error">
          {actionData.errors.title}
        </div>
      ) : null} */}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Body: </span>
          <textarea
            //   ref={bodyRef}
            name="body"
            rows={8}
            className="w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6"
            //   aria-invalid={actionData?.errors?.body ? true : undefined}
            //   aria-errormessage={
            //     actionData?.errors?.body ? "body-error" : undefined
            //   }
          />
        </label>
        {/* {actionData?.errors?.body ? (
        <div className="pt-1 text-red-700" id="body-error">
          {actionData.errors.body}
        </div>
      ) : null} */}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </form>
  );
}
