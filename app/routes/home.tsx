import { database } from "~/database/context";
import * as schema from "~/database/schema";

import type { Route } from "./+types/home";

import { sessionStorage } from "~/services/auth.server";
import { Form, useFetcher } from "react-router";
import { authenticate } from "~/services/authenticate";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import type { loader as loaderIsPostLiked } from "./isPostLiked";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
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
          // comments: {
          //   with: {
          //     authorId: {
          //       columns: {
          //         firstName: true,
          //         lastName: true,
          //         id: true,
          //         profilePictureAddress: true,
          //       },
          //     },
          //   },
          // },
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

function LikePost({ postId }: { postId: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const fetcher = useFetcher<{
    postId: string;
    like: boolean;
    userId: string;
  }>();

  const fetcherLoader = useFetcher<typeof loaderIsPostLiked>();

  useEffect(() => {
    fetcherLoader.load("post/isLiked/" + postId);
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return (
    <fetcher.Form
      method="post"
      action={`/post/like/${postId}`}
      className="flex-1 flex items-center justify-center border-amber-50 border-2 bg-orange-50"
    >
      <button
        type="submit"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="hover:cursor-pointer w-full"
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

type post = Required<
  Pick<Awaited<ReturnType<typeof loader>>, "postsToDisplay">
>["postsToDisplay"][number];

function PostHeader({ post }: { post: post }) {
  return (
    <div className="flex">
      <div className="flex flex-col bg-amber-50 p-2 flex-20">
        <div className="flex items-end gap-1">
          <h1 className="text-2xl text-shadow">{post.text}</h1>
          <h2 className="text-xl">
            {post.authorId.firstName} {post.authorId.lastName}
          </h2>
        </div>
        <h3 className="text-sm">
          {`${post.datePublished.toString()}`}{" "}
          {post.datePublished.toString() !== post.dateUpdated.toString()
            ? post.dateUpdated.toString()
            : null}
        </h3>
      </div>
      <LikePost postId={post.id} />
    </div>
  );
}

function PostCard({ post }: { post: post }) {
  return (
    <article className="bg-white mb-6 shadow-xl">
      <PostHeader post={post} />
      <span className="p-5 block">{post.text}</span>
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
        <section>
          <h3 className="p-1 h-fit break-words bg-gray-200/50 w-full text-center mb-10">
            {JSON.stringify(loaderData.user)}
          </h3>
          {loaderData.postsToDisplay &&
            loaderData.postsToDisplay.map((post) => (
              <PostCard post={post} key={post.id} />
            ))}
        </section>
      )}
      {!loaderData.user && (
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
