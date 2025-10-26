import type { Route } from "./+types/likeComment";
import { authenticate } from "~/services/authenticate";

import { database } from "~/database/context";
import * as schema from "~/database/schema";
import isBoolean from "validator/lib/isBoolean";

export async function action({ request, params }: Route.ActionArgs) {
  const user = await authenticate(request);

  const commentId = params.commentId;

  const formData = await request.formData();
  const shouldLike = String(formData.get("shouldLike"));
  if (!isBoolean(shouldLike)) throw new Error("shouldLike shoudl be a boolean");
  const like = JSON.parse(shouldLike);

  const db = database();

  try {
    const commentLikedResponse = await db
      .insert(schema.usersLikedComments)
      .values({
        commentId,
        userId: user.id,
        like,
      })
      .onConflictDoUpdate({
        target: [
          schema.usersLikedComments.commentId,
          schema.usersLikedComments.userId,
        ],
        set: { like },
      })
      .returning();
    return commentLikedResponse[0]
  } catch (error) {
    throw new Error(JSON.stringify(error));
  } 
}
