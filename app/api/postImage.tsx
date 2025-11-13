import {
  getPostImageStorageKey,
  postImageStorage,
} from "~/services/post-storage.server";
import type { Route } from "./+types/postImage";

export async function loader({ params }: Route.LoaderArgs) {
  const storageKey = getPostImageStorageKey(params.postId);
  const file = await postImageStorage.get(storageKey);

  if (!file) {
    throw new Response("Post image not found", { status: 404 });
  }

  console.log("image found!");

  return new Response(file.stream(), {
    headers: {
      "Content-Type": file.type,
      "Content-Disposition": `attachment; filename=${file.name}`,
    },
  });
}
