import { Form } from "react-router";
import type { Route } from "./+types/post";

import { authenticate } from "~/services/authenticate";
import invariant from "tiny-invariant";

import { database } from "~/database/context";
import * as schema from "~/database/schema";

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
  return (
    <Form className="w-9/10 bg-amber-50/90" method="post">
      {actionData ? <span>{JSON.stringify(actionData)}</span> : null}
      <h1 className="text-5xl p-5 text-center">Create a new post</h1>
      <div className="flex items-center justify-center flex-col">
        <label
          htmlFor="postTitle"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Post Title:
        </label>
        <input
          type="text"
          name="postTitle"
          id="postTitle"
          className={`shadow appearance-none border border-gray-200 rounded w-9/10  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white text-center mb-4`}
        />
      </div>
      <div className="flex items-center justify-center flex-col mb-5">
        <label
          htmlFor="postContent"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Post Title:
        </label>
        <textarea
          name="postContent"
          id="postContet"
          className="w-9/10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white py-2 px-3"
        />
      </div>
      <div className="flex items-center justify-center flex-col mb-6">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:cursor-pointer"
        >
          Post
        </button>
      </div>
    </Form>
  );
}
