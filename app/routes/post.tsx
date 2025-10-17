import { Form } from "react-router";
import type { Route } from "./+types/post";
import { authenticate } from "~/services/authenticate";

import { database } from "~/database/context";
import * as schema from "~/database/schema";
import { and, asc, eq, getTableColumns, sql } from "drizzle-orm";

export async function loader({ request, params }: Route.LoaderArgs) {
  const user = await authenticate(request);
  const postId = params.postId;

  const db = database();

  const { password, created, email, ...restOfUser } = getTableColumns(
    schema.users
  );

  console.log("======================");

  try {
    const thePost = await db
      .select({
        ...getTableColumns(schema.posts),
        userHasLiked: sql<boolean>`EXISTS((${db
          .select()
          .from(schema.usersLikedPosts)
          .where(
            and(
              eq(schema.usersLikedPosts.postId, schema.posts.id),
              and(
                eq(schema.usersLikedPosts.userId, user.id),
                eq(schema.usersLikedPosts.like, true)
              )
            )
          )}))`,
        comments: sql<Array<typeof schema.comments.$inferSelect>>`
        COALESCE(
        array_agg(
          json_build_object(
            'id', ${schema.comments.id},
            'content', ${schema.comments.text},
            'createdAt', ${schema.comments.datePublished}
          )
        ) FILTER (WHERE ${schema.comments.id} IS NOT NULL),
        '{}'::json[]
      )
    `,
        author: sql<
          Pick<
            typeof schema.users.$inferSelect,
            "id" | "firstName" | "lastName"
          >
        >`
        (
            SELECT json_build_object(
                'userId', ${schema.users.id},
                'firstName', ${schema.users.firstName},
                'lastName', ${schema.users.lastName}
                )
            FROM users
            WHERE users.id = ${schema.posts.authorId}
        )
      `,
      })
      .from(schema.posts)
      .where(eq(schema.posts.id, postId))
      .leftJoin(schema.comments, eq(schema.posts.id, schema.comments.postId))
      .groupBy(schema.posts.id);

    return thePost[0];
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
}

export default function post({ loaderData }: Route.ComponentProps) {
  return (
    <article className="h-full bg-amber-50/20 w-full flex flex-col justify-between">
      <section id="post-content" className="w-full">
        <div id="post-header" className="bg-amber-100/99">
          <h1 className="text-4xl p-2">{loaderData.title}</h1>
          <h2 className="p-2 text-xl">
            {loaderData.author.lastName}, {loaderData.author.firstName}
          </h2>
        </div>
        <div id="text-content" className="bg-white border-amber-100 border p-4">
          {loaderData.text}
        </div>
      </section>
      <section id="post-comments" className="h-10 bg-white">
        <ul>
          {/* {loaderData.comments.map((comment) => (
            <li>
              <div>
                <h2>{comment.}</h2>
              </div>
            </li>
          ))} */}
        </ul>
      </section>
    </article>
  );
}
