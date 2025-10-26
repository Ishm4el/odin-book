import type { Route } from "./+types/isCommentLiked";
import { database } from "~/database/context";
import { authenticate } from "~/services/authenticate";

export async function loader({ params, request }: Route.LoaderArgs) {
  const user = await authenticate(request);
  const userId = user.id;

  const commentId = params.commentId;

  const db = database();

  return await db.query.usersLikedComments
    .findFirst({
      where: (t, { and, eq }) =>
        and(eq(t.commentId, commentId), eq(t.userId, userId)),
    })
    .then((res) => {
      if (res) return res;
      else return { like: false, commentId, userId };
    });
}
