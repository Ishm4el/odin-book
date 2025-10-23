import { Form, useNavigate } from "react-router";
import type { Route } from "./+types/post";
import { authenticate } from "~/services/authenticate";

import { database } from "~/database/context";
import * as schema from "~/database/schema";
import { and, eq, sql } from "drizzle-orm";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

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
            orderBy: (t, { desc }) => [desc(t.datePublished)],
          },
        },
      }),
    ]);

    return { userLiked: userLiked[0], post: postData };
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
}

export async function action({ params, request }: Route.ActionArgs) {
  const user = await authenticate(request);

  const postId = params.postId;

  const data = await request.formData();
  const text = String(data.get("newComment"));

  const db = database();

  try {
    if (text.length <= 0) throw "Text is required in order to comment!";

    await db
      .insert(schema.comments)
      .values({ authorId: user.id, postId, text });

    return { res: "Comment uploaded!" };
  } catch (e) {
    // console.error("Failed to create comment", e);
    return { error: e };
  }
}

export function HydrateFallback() {
  return <p>Loading Post!</p>;
}

export default function post({ loaderData, actionData }: Route.ComponentProps) {
  const navigate = useNavigate();

  const refForm = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (actionData?.error) {
      toast.error(JSON.stringify(actionData.error));
    } else if (actionData?.res && refForm.current) {
      refForm.current.reset();
      toast.success(JSON.stringify(actionData.res));
    }
  }, [actionData]);

  if (loaderData.post)
    return (
      <article className="h-full bg-amber-50/20 w-full flex flex-col justify-between overflow-y-scroll">
        <section id="post-content">
          <div id="post-header" className="bg-amber-100/99">
            <h1 className="text-4xl p-2">{loaderData.post.title}</h1>
            <h2
              className="p-2 text-xl hover:text-amber-900 w-fit hover:cursor-pointer active:text-amber-500"
              onClick={() => {
                navigate(`/profile/${loaderData.post?.authorId.id}`);
              }}
            >
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
          <Form
            method="post"
            className="shadow mb-3 p-1 flex flex-col gap-3"
            ref={refForm}
          >
            <div className="flex flex-col">
              <label
                htmlFor="newComment"
                className="text-center mb-1 underline"
              >
                Comment?
              </label>
              <textarea
                name="newComment"
                id="newComment"
                className="ring mx-3"
              ></textarea>
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
              <li className="mb-1 p-1 shadow" key={comment.id}>
                <div className="flex gap-2 bg-amber-50/90">
                  <div
                    className="flex gap-1"
                    onClick={() => {
                      navigate(`/profile/${comment.authorId.id}`);
                    }}
                  >
                    <h2 className="hover:text-amber-900 w-fit hover:cursor-pointer active:text-amber-500">
                      {comment.authorId.firstName} {comment.authorId.lastName}
                    </h2>
                    <img
                      src={comment.authorId.profilePictureAddress}
                      alt=""
                      className="inline object-cover rounded-full border border-amber-300 hover:cursor-pointer hover:border-amber-500 size-[calc(var(--text-base--line-height)*var(--text-base))]"
                    />
                  </div>
                  <h3>{comment.datePublished.toDateString()}</h3>
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
