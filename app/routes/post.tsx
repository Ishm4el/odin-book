import { Form } from "react-router";
import type { Route } from "./+types/post";
import { authenticate } from "~/services/authenticate";

import { database } from "~/database/context";
import * as schema from "~/database/schema";

export async function loader({ request, params }: Route.LoaderArgs) {
  const user = await authenticate(request);
  const postId = params.postId;

  const db = database();

  try {
    const aPost = await db.query.posts.findFirst({
      where: (t, { eq }) => eq(t.id, postId),
    });
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
}

export default function post({ loaderData }: Route.ComponentProps) {
  return (
    <article>
      <section id="post-content"></section>
      <section id="post-comments"></section>
    </article>
  );
}
