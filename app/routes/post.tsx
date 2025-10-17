import { Form } from "react-router";
import type { Route } from "./+types/post";
import { authenticate } from "~/services/authenticate";

import { database } from "~/database/context";
import * as schema from "~/database/schema";
import { and, asc, eq, getTableColumns, sql } from "drizzle-orm";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Post: ${params.postId}` },
    { name: "description", content: "Viewing a specfic post" },
  ];
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const user = await authenticate(request);
  const postId = params.postId;

  const db = database();

  try {
    const [userLiked, postData] = await Promise.all([
      db
        .select({
          userLiked: sql<boolean | undefined>`EXISTS((${db
            .select()
            .from(schema.usersLikedPosts)
            .where(
              and(
                eq(schema.usersLikedPosts.postId, postId),
                and(
                  eq(schema.usersLikedPosts.userId, user.id),
                  eq(schema.usersLikedPosts.like, true)
                )
              )
            )}))`,
        })
        .from(schema.usersLikedPosts)
        .where(eq(schema.usersLikedPosts.postId, postId)),

      db.query.posts.findFirst({
        where: eq(schema.posts.id, postId),
        with: {
          authorId: {
            columns: {
              id: true,
              firstName: true,
              lastName: true,
              profilePictureAddress: true,
            },
          },
          comments: {
            with: {
              authorId: {
                columns: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  profilePictureAddress: true,
                },
              },
            },
          },
        },
      }),
    ]);

    return { userLiked: userLiked[0], post: postData };
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
}

export function HydrateFallback() {
  return <p>Loading Post!</p>;
}

export default function post({ loaderData }: Route.ComponentProps) {
  if (loaderData.post)
    return (
      <article className="h-full bg-amber-50/20 w-full flex flex-col justify-between">
        <section id="post-content" className="w-full">
          <div id="post-header" className="bg-amber-100/99">
            <h1 className="text-4xl p-2">{loaderData.post.title}</h1>
            <h2 className="p-2 text-xl">
              {loaderData.post.authorId.lastName},{" "}
              {loaderData.post.authorId.firstName}
            </h2>
          </div>
          <div
            id="text-content"
            className="bg-white border-amber-100 border p-4"
          >
            {loaderData.post.text}
          </div>
        </section>
        <section id="post-comments" className="bg-white">
          <Form method="post" className="shadow mb-3 p-1 flex flex-col gap-3">
            <div className="flex flex-col">
              <label htmlFor="newComment" className="text-center mb-1 underline">
                Comment?
              </label>
              <textarea name="newComment" id="newComment" className="ring"></textarea>
            </div>
            <button
              type="submit"
              className="border rounded mb-1 w-1/2 self-center hover:cursor-pointer bg-orange-50 hover:bg-orange-100 focus:bg-orange-100"
            >
              Post Comment
            </button>
          </Form>
          <ul>
            {loaderData.post.comments.map((comment) => (
              <li className="mb-1 p-1 shadow">
                <div className="flex gap-3 bg-amber-50/90">
                  <h2>
                    {comment.authorId.firstName} {comment.authorId.lastName}
                  </h2>
                  <h3>{comment.datePublished.toString()}</h3>
                </div>
                <div>{comment.text}</div>
              </li>
            ))}
          </ul>
        </section>
      </article>
    );
  else return <article className="block">No post data was found..</article>;
}
