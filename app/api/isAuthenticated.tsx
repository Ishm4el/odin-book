import type { Route } from "./+types/isAuthenticated";
import { sessionStorage, type User } from "~/services/auth.server";

export async function loader({ params, request }: Route.LoaderArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie"),
  );
  const user = session.get<"user">("user");

  const determineIfIsUser = (
    toBeDetermined: unknown,
  ): toBeDetermined is User => {
    if (typeof toBeDetermined !== "object") return false;
    if ((toBeDetermined as User).id) return true;
    else return false;
  };

  return determineIfIsUser(user) ? { user } : {};
}
