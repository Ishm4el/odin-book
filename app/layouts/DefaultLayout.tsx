import { Outlet } from "react-router";
import NavBar from "~/components/NavBar";
import type { Route } from "./+types/DefaultLayout";
import { sessionStorage } from "~/services/auth.server";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const user = session.get("user");

  const image = fetch("http://localhost:3000/profileImages/theDefault.jpg");

  return { user, image };
}

export default function DefaultLayout({ loaderData }: Route.ComponentProps) {
  return (
    <>
      {loaderData.user ? (
        <NavBar
          navigationList={[
            { title: "Home", to: "/" },
            { title: "Logout", to: "/logout" },
          ]}
        />
      ) : (
        <NavBar />
      )}
      <main className="flex justify-center h-[calc(100vh-2.5rem)]">
        <Outlet />
      </main>
    </>
  );
}
