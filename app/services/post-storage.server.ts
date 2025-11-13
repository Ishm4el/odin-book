import { LocalFileStorage } from "@remix-run/file-storage/local";

export const postImageStorage = new LocalFileStorage("./server/postImages");

export function getPostImageStorageKey(postId: string) {
  return `post-${postId}-image`;
}
