import type { Route } from "./+types/post";
import { authenticate } from "~/services/authenticate";
import { database } from "~/database/context";
import * as schema from "~/database/schema";
import { and, eq, sql } from "drizzle-orm";
import PostContent from "./postComponents/PostContent";
import PostComment from "./postComponents/PostComment";

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
                  eq(schema.usersLikedPosts.like, true),
                ),
              ),
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
            },
          },
          comments: {
            with: {
              authorId: {
                columns: {
                  id: true,
                  firstName: true,
                  lastName: true,
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
    return { error: e };
  }
}

export function HydrateFallback() {
  return <p>Loading Post!</p>;
}

export default function post({ loaderData, actionData }: Route.ComponentProps) {
  if (loaderData.post)
    return (
      <article className="flex h-full w-full flex-col justify-between overflow-y-scroll bg-amber-50/20">
        <PostContent />
        <PostComment />
      </article>
    );
  else return <article className="block">No post data was found..</article>;
}
