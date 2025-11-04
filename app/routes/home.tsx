import { database } from "~/database/context";
import * as schema from "~/database/schema";

import type { Route } from "./+types/home";

import { sessionStorage } from "~/services/auth.server";
import { Form, NavLink, useFetcher, useNavigate } from "react-router";
import { authenticate } from "~/services/authenticate";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import type { loader as loaderIsPostLiked } from "../api/isPostLiked";
import { and, asc, eq, exists, getTableColumns, sql } from "drizzle-orm";
import UnauthorizedUserHomePage from "./homeComponents/UnauthorizedUserHomePage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ context, request }: Route.LoaderArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie"),
  );
  const user = session.get("user");

  const db = database();
  if (user)
    try {
      const isLikedByUser = exists(
        db
          .select()
          .from(schema.usersLikedPosts)
          .where(
            and(
              eq(schema.usersLikedPosts.postId, schema.posts.id),
              eq(schema.usersLikedPosts.userId, user.id),
            ),
          ),
      );

      const { password, created, email, birthdate, ...restOfUser } =
        getTableColumns(schema.users);

      const postsToDisplay = await db
        .select({
          post: getTableColumns(schema.posts),
          userHasLiked: sql<boolean>`EXISTS((${db
            .select()
            .from(schema.usersLikedPosts)
            .where(
              and(
                eq(schema.usersLikedPosts.postId, schema.posts.id),
                and(
                  eq(schema.usersLikedPosts.userId, user.id),
                  eq(schema.usersLikedPosts.like, true),
                ),
              ),
            )}))`,
          user: { ...restOfUser },
        })
        .from(schema.posts)
        .leftJoin(schema.users, eq(schema.posts.authorId, schema.users.id))
        .orderBy(asc(schema.posts.datePublished));

      console.log(postsToDisplay);

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

function LikePost({ postId }: { postId: string }) {
  const fetcher = useFetcher<{
    postId: string;
    like: boolean;
    userId: string;
  }>();

  const fetcherLoader = useFetcher<typeof loaderIsPostLiked>();

  useEffect(() => {
    fetcherLoader.load("post/isLiked/" + postId);
  }, []);

  return (
    <fetcher.Form
      method="post"
      action={`/post/like/${postId}`}
      className="flex flex-3 items-center justify-center border-2 border-amber-50 bg-orange-50 md:flex-1"
    >
      <button
        type="submit"
        className="w-full hover:cursor-pointer"
        name="shouldLike"
        value={fetcherLoader.data?.like ? "false" : "true"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className={
            fetcherLoader.data?.like
              ? "fill-amber-500 hover:fill-amber-100"
              : "hover:fill-amber-400"
          }
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
      </button>
    </fetcher.Form>
  );
}

type loadedData = Required<
  Pick<Awaited<ReturnType<typeof loader>>, "postsToDisplay">
>["postsToDisplay"][number];

function PostHeader({ loadedData }: { loadedData: loadedData }) {
  const navigate = useNavigate();
  return (
    <div className="flex">
      <div className="flex flex-20 flex-col bg-amber-50 p-2">
        <div className="flex flex-wrap items-end gap-5">
          <NavLink
            to={`/post/${loadedData.post.id}`}
            className="text-3xl text-shadow-amber-500 hover:text-amber-900 hover:underline"
          >
            {loadedData.post.title}
          </NavLink>
          <div
            className="flex gap-1"
            onClick={() => {
              navigate(`/profile/${loadedData.post.authorId}`);
            }}
          >
            <h2 className="w-fit text-xl hover:cursor-pointer hover:text-amber-900 active:text-amber-500">
              {loadedData.user?.firstName} {loadedData.user?.lastName}
            </h2>
            <img
              src={`http://localhost:3000${loadedData.user?.profilePictureAddress}`}
              alt=""
              className="inline size-[calc(var(--text-xl--line-height)*var(--text-xl))] rounded-full border border-amber-300 object-cover hover:cursor-pointer hover:border-amber-500"
            />
          </div>
        </div>
        <h3 className="text-sm">
          {`${loadedData.post.datePublished.toString()}`}{" "}
          {loadedData.post.datePublished.toString() !==
          loadedData.post.dateUpdated.toString()
            ? loadedData.post.dateUpdated.toString()
            : null}
        </h3>
      </div>
      <LikePost postId={loadedData.post.id} />
    </div>
  );
}

function PostCard({ loadedData }: { loadedData: loadedData }) {
  return (
    <article className="mb-6 bg-white shadow-xl">
      <PostHeader loadedData={loadedData} />
      <span className="block p-5">{loadedData.post.text}</span>
      {/* <PostCommentForm post={post} />
      <CommentList post={post} /> */}
    </article>
  );
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
      {loaderData.user && loaderData.postsToDisplay && (
        <section className="w-full overflow-y-scroll p-5">
          {loaderData.postsToDisplay &&
            loaderData.postsToDisplay.map((post) => (
              <PostCard loadedData={post} key={post.post.id} />
            ))}
        </section>
      )}
      {!loaderData.user && (
        <UnauthorizedUserHomePage
          message={loaderData.message ?? "There wasn't a message"}
        />
      )}
      <ToastContainer />
    </>
  );
}
