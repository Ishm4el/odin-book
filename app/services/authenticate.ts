import { redirect } from "react-router";
import { sessionStorage, type User } from "./auth.server";

export async function authenticate(request: Request, returnTo?: string) {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );

  const user = session.get("user");

  const determineIfIsUser = (
    toBeDetermined: unknown
  ): toBeDetermined is User => {
    if (typeof toBeDetermined !== "object") return false;
    if ((toBeDetermined as User).id) return true;
    else return false;
  };

  if (determineIfIsUser(user)) return user;
  if (returnTo) session.set("returnTo", returnTo);
  throw redirect("/login", {
    headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
  });
}
