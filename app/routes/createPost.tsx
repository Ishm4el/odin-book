import { Form, useNavigate } from "react-router";
import type { Route } from "./+types/createPost";

import { authenticate } from "~/services/authenticate";
import invariant from "tiny-invariant";

import { database } from "~/database/context";
import * as schema from "~/database/schema";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const postTitle = formData.get("postTitle");
  const postContent = formData.get("postContent");

  invariant(postTitle, "Please enter a title");
  invariant(postContent, "Please enter content");

  if (typeof postTitle !== "string")
    throw new Error("postTitle must be a string");
  if (typeof postContent !== "string")
    throw new Error("postContent must be a string");

  const user = await authenticate(request);

  const db = database();
  try {
    return await db
      .insert(schema.posts)
      .values({ authorId: user.id, title: postTitle, text: postContent })
      .returning();
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
}

export default function Component({ actionData }: Route.ComponentProps) {
  const formRef = useRef<null | HTMLFormElement>(null);
  useEffect(() => {
    if (actionData) {
      if (formRef.current) formRef.current.reset();
      toast.success(
        "The post '" + actionData[0].title + "'!\nhas been posted",
        {
          toastId: "PostPublishOutSuccess",
          ariaLabel: "Post uploaded!",
          onClose: () => {},
        },
      );
    }
  }, [actionData]);

  return (
    <section className="w-full p-5">
      <Form className="bg-amber-50/90" method="post" ref={formRef}>
        <h1 className="p-5 text-center text-5xl">Create a new post</h1>
        <div className="flex flex-col items-center justify-center">
          <label
            htmlFor="postTitle"
            className="mb-2 block text-sm font-bold text-gray-700"
          >
            Post Title:
          </label>
          <input
            type="text"
            name="postTitle"
            id="postTitle"
            className={`focus:shadow-outline mb-4 w-9/10 appearance-none rounded border border-gray-200 bg-white px-3 py-2 text-center leading-tight text-gray-700 shadow focus:outline-none`}
          />
        </div>
        <div className="mb-5 flex flex-col items-center justify-center">
          <label
            htmlFor="postContent"
            className="mb-2 block text-sm font-bold text-gray-700"
          >
            Post Content:
          </label>
          <textarea
            name="postContent"
            id="postContet"
            className="not-first h-[60vh] w-9/10 rounded-md border border-gray-300 bg-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div className="mb-6 flex flex-col items-center justify-center">
          <button
            type="submit"
            className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white transition-colors hover:cursor-pointer hover:bg-blue-700 focus:bg-blue-700 focus:outline-none"
          >
            Post
          </button>
        </div>
      </Form>
    </section>
  );
}
