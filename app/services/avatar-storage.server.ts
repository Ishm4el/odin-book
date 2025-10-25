import { LocalFileStorage } from "@remix-run/file-storage/local";

export const fileStorage = new LocalFileStorage("./server/profileImages");

export function getStorageKey(userId: string) {
  return `user-${userId}-avatar`;
}
