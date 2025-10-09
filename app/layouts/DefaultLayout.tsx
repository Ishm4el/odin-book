import { Outlet } from "react-router";
import NavBar from "~/components/NavBar";

export default function DefaultLayout() {
  return (
    <>
      <NavBar />
      <main className="flex justify-center h-[calc(100vh-2.5rem)]">
        <Outlet />
      </main>
    </>
  );
}
