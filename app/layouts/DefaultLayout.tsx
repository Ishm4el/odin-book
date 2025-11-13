import { Outlet } from "react-router";
import NavBar from "~/components/NavBar";
import type { Route } from "./+types/DefaultLayout";
import { sessionStorage, type User } from "~/services/auth.server";
import { ToastContainer } from "react-toastify";

export async function loader({ request }: Route.LoaderArgs) {
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

export default function DefaultLayout({ loaderData }: Route.ComponentProps) {
  return (
    <>
      {loaderData.user ? (
        <NavBar
          navigationList={[
            { title: "Home", to: "/" },
            { title: "Post", to: "/post/create" },
            { title: "Users", to: "/profile/search" },
            { title: "Logout", to: "/logout" },
          ]}
          user={{
            name: loaderData.user.firstName,
            userId: loaderData.user.id,
          }}
        />
      ) : (
        <NavBar />
      )}
      <main className="h-[calc(100vh-2.5rem)] w-full items-center bg-[url(/booksBackgroundImage.jpg)] bg-cover bg-center bg-no-repeat p-5 md:flex md:h-screen md:flex-col">
        <Outlet />
      </main>
      <ToastContainer />
    </>
  );
}
