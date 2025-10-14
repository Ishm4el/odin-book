import { database } from "~/database/context";
import * as schema from "~/database/schema";

import type { Route } from "./+types/home";

import { sessionStorage } from "~/services/auth.server";
import { Form } from "react-router";
import { authenticate } from "~/services/authenticate";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
    {},
  ];
}

export async function loader({ context, request }: Route.LoaderArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const user = session.get("user");

  const db = database();
  if (user)
    try {
      const postsToDisplay = await db.query.posts.findMany({
        orderBy: (posts, { asc }) => [asc(posts.datePublished)],
        with: {
          authorId: {
            columns: {
              firstName: true,
              lastName: true,
              id: true,
              profilePictureAddress: true,
            },
          },
          comments: {
            with: {
              authorId: {
                columns: {
                  firstName: true,
                  lastName: true,
                  id: true,
                  profilePictureAddress: true,
                },
              },
            },
          },
        },
      });
      return { user, postsToDisplay };
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }

  return {
    message: context.VALUE_FROM_EXPRESS,
    user: user,
  };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const postId = String(formData.get("postId"));
  const comment = String(formData.get("comment"));

  const user = await authenticate(request);

  const db = database();

  try {
    return db
      .insert(schema.comments)
      .values({
        authorId: user.id,
        postId,
        text: comment,
      })
      .returning();
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
}

export default function Home({ actionData, loaderData }: Route.ComponentProps) {
  useEffect(() => {
    if (actionData) {
      toast.success("Your comment has been posted!", {
        toastId: actionData[0].id,
      });
    }
  }, [actionData]);

  return (
    <>
      {loaderData.user ? (
        <section>
          <h3 className="p-1 h-fit break-words bg-gray-200/50 w-full text-center mb-10">
            {JSON.stringify(loaderData.user)}
          </h3>
          {loaderData.postsToDisplay &&
            loaderData.postsToDisplay.map((post) => (
              <article className="bg-white mb-6 shadow-2xl" key={post.id}>
                <div className="flex flex-col bg-amber-50 p-2">
                  <div className="flex items-end gap-1">
                    <h1 className="text-2xl text-shadow">{post.title}</h1>
                    <h2 className="text-xl">
                      {post.authorId.firstName} {post.authorId.lastName}
                    </h2>
                  </div>
                  <h3 className="text-sm">
                    {`${post.datePublished.toString()}`}{" "}
                    {post.datePublished.toString() !==
                    post.dateUpdated.toString()
                      ? post.dateUpdated.toString()
                      : null}
                  </h3>
                </div>

                <span className="lg p-5 block">{post.text}</span>

                <Form
                  method="post"
                  className="w-full flex p-2"
                  onSubmit={(e) => {
                    e.currentTarget.rest();
                  }}
                >
                  <input
                    type="text"
                    hidden
                    value={post.id}
                    name="postId"
                    id="postId"
                    readOnly
                  />
                  <input
                    type="text"
                    className="flex-1 ring p-1"
                    name="comment"
                    id="comment"
                  />
                  <button
                    className="bg-blue-500 focus:bg-blue-700 transition-colors hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:cursor-pointer"
                    type="submit"
                  >
                    Post Comment
                  </button>
                </Form>

                <ul id="comments">
                  {post.comments &&
                    post.comments.map((comment) => (
                      <li
                        key={comment.id}
                        className="p-3 inset-shadow-sm inset-shadow-indigo-200"
                      >
                        <h4 className="inline">
                          {comment.authorId.firstName}{" "}
                          {comment.authorId.lastName}{" "}
                        </h4>
                        <img
                          src={`http://localhost:3000${comment.authorId.profilePictureAddress}`}
                          alt="commentor profile picture"
                          className="size-5 inline object-contain rounded-2xl border border-amber-300 hover:cursor-pointer hover:border-amber-500"
                        />
                        <h4 className="inline">
                          {" - "}
                          {comment.datePublished.toString()}
                        </h4>
                        <br />
                        <span>{comment.text}</span>
                      </li>
                    ))}
                </ul>
              </article>
            ))}
        </section>
      ) : (
        <>
          <h1 className="text-7xl text-amber-300 bg-amber-50/60 w-full text-center p-10 text-shadow-lg">
            Welcome to the homepage!
          </h1>
          <h2 className="text-5xl bg-white/50 w-full text-center">
            A Brief Message From The Server: {loaderData.message}
          </h2>
        </>
      )}
      <ToastContainer />
    </>
  );
}
