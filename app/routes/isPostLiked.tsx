import type { Route } from "./+types/isPostLiked";
import { database } from "~/database/context";
import { authenticate } from "~/services/authenticate";

export async function loader({ params, request }: Route.LoaderArgs) {
  const user = await authenticate(request);

  const db = database();

  try {
    const isPostLiked = await db.query.usersLikedPosts.findFirst({
      where: (t, { and, eq }) =>
        and(eq(t.postId, params.postId), eq(t.userId, user.id)),
    });

    // console.log(isPostLiked);

    return isPostLiked;
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
}
