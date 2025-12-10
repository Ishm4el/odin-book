import { Form, useNavigate } from "react-router";
import type { Route } from "./+types/createPost";

import { authenticate } from "~/services/authenticate";
import invariant from "tiny-invariant";

import { database } from "~/database/context";
import * as schema from "~/database/schema";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import {
  postImageStorage,
  getPostImageStorageKey,
} from "~/services/post-storage.server";
import { FileUpload, parseFormData } from "@remix-run/form-data-parser";

export async function action({ request }: Route.ActionArgs) {
  const generateId = crypto.randomUUID();
  console.log(generateId);

  async function uploadHandler(fileUpload: FileUpload) {
    if (
      fileUpload.fieldName === "post-image" &&
      fileUpload.type.startsWith("image/")
    ) {
      const storageKey = getPostImageStorageKey(generateId);
      await postImageStorage.set(storageKey, fileUpload);

      const fileFromStorage = await postImageStorage.get(storageKey);

      if (fileFromStorage) console.log(fileFromStorage.name);
      return fileFromStorage;
    }
  }

  const formData = await parseFormData(request, uploadHandler);

  const postTitle = formData.get("postTitle");
  const postContent = formData.get("postContent");
  const postImage = formData.get("post-image");

  invariant(postTitle, "Please enter a title");
  invariant(postContent, "Please enter content");

  if (typeof postTitle !== "string")
    throw new Error("postTitle must be a string");
  if (typeof postContent !== "string")
    throw new Error("postContent must be a string");

  const user = await authenticate(request);

  console.log("PRINTING POST-IMAGE");
  console.log(postImage);

  const db = database();
  try {
    return await db
      .insert(schema.posts)
      .values({
        authorId: user.id,
        title: postTitle,
        text: postContent,
        id: generateId,
        hasImage: postImage ? true : false,
      })
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
    <section className="flex h-full max-h-full w-full flex-col overflow-hidden">
      <Form
        className="flex h-full flex-col bg-amber-50/90 p-5 dark:bg-amber-950/90"
        method="post"
        ref={formRef}
        encType="multipart/form-data"
      >
        <h1 className="p-5 text-center text-5xl">Create a new post</h1>
        <div className="flex flex-col items-center justify-center">
          <label
            htmlFor="postTitle"
            className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300"
          >
            Post Title:
          </label>
          <input
            type="text"
            name="postTitle"
            id="postTitle"
            className={`focus:shadow-outline mb-4 w-9/10 appearance-none rounded border border-gray-200 bg-white px-3 py-2 text-center leading-tight text-gray-800 shadow focus:outline-none dark:border-gray-800 dark:bg-black dark:text-gray-200`}
          />
        </div>
        <div className="mb-5 flex flex-col items-center justify-center">
          <label
            htmlFor="post-image"
            className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300"
          >
            Attach Image?
          </label>
          <input
            type="file"
            id="post-image"
            name="post-image"
            accept="image/*"
            className="text-sm text-gray-700 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:cursor-pointer hover:file:bg-violet-200 dark:text-gray-500 dark:file:bg-violet-950 dark:file:text-violet-300 dark:hover:file:bg-violet-800"
          />
        </div>
        <div className="mb-5 flex flex-1 basis-full flex-col items-center justify-stretch">
          <label
            htmlFor="postContent"
            className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300"
          >
            Post Content:
          </label>
          <textarea
            name="postContent"
            id="postContet"
            className="not-first w-9/10 flex-1 basis-full rounded-md border border-gray-300 bg-white px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-300 dark:bg-black dark:focus:ring-blue-500"
          />
        </div>
        <div className="mb-6 flex flex-col items-center justify-center">
          <button
            type="submit"
            className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white transition-colors hover:cursor-pointer hover:bg-blue-700 focus:bg-blue-700 focus:outline-none dark:bg-blue-600 dark:text-gray-100 dark:hover:bg-blue-800 dark:focus:bg-blue-800"
          >
            Post
          </button>
        </div>
      </Form>
    </section>
  );
}
