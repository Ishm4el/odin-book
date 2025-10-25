import { fileStorage, getStorageKey } from "~/services/avatar-storage.server";
import type { Route } from "./+types/avatar";

export async function loader({ params }: Route.LoaderArgs) {
  const storageKey = getStorageKey(params.profileId);
  const file = await fileStorage.get(storageKey);

  if (!file) {
    throw new Response("User aatar not found", { status: 404 });
  }

  return new Response(file.stream(), {
    headers: {
      "Content-Type": file.type,
      "Content-Disposition": `attachment; filename=${file.name}`,
    },
  });
}
