import { authenticate } from "~/services/authenticate";
import type { Route } from "./+types/postLikeComment";

import { database } from "~/database/context";
import * as schema from "~/database/schema";
import isBoolean from "validator/lib/isBoolean";

export async function action({ request, params }: Route.ActionArgs) {
  console.log(params);
  console.log(request.method);
  const user = await authenticate(request);
  console.log(user);

  const formData = await request.formData();
  console.log(formData);
  const shouldLike = String(formData.get("shouldLike"));
  if (!isBoolean(shouldLike)) throw new Error("shouldLike should be a boolean");
  const shouldLikeBool = JSON.parse(shouldLike);

  console.log(shouldLikeBool);

  const db = database();
  try {
    const liked = await db
      .insert(schema.usersLikedPosts)
      .values({
        like: shouldLikeBool,
        postId: params.postId,
        userId: user.id,
      })
      .onConflictDoUpdate({
        target: [schema.usersLikedPosts.postId, schema.usersLikedPosts.userId],
        set: { like: shouldLikeBool },
      })
      .returning();

    console.log(liked[0]);

    return { ...liked[0] };
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
}
