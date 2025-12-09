import { database } from "~/database/context";
import * as schema from "~/database/schema";

import type { Route } from "./+types/index";

import { sessionStorage } from "~/services/auth.server";
import { authenticate } from "~/services/authenticate";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { and, asc, eq, exists, getTableColumns, sql } from "drizzle-orm";
import UnauthorizedUserHomePage from "./UnauthorizedUserHomePage";
import { PostCard } from "./HomePostCard";

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
        <section className="w-full">
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
