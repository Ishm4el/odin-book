import { Outlet } from "react-router";
import NavBar from "~/components/NavBar";
import type { Route } from "./+types/DefaultLayout";
import { ToastContainer } from "react-toastify";

export default function DefaultLayout({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <NavBar />
      <main className="h-[calc(100vh-2.5rem)] w-full items-center overflow-y-scroll bg-[url(/booksBackgroundImage.jpg)] bg-cover bg-center bg-no-repeat p-5 md:flex md:h-screen md:flex-col">
        <Outlet />
      </main>
      <ToastContainer />
    </>
  );
}
