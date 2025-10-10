import { Outlet } from "react-router";
import type { Route } from "./+types/ProtectedLayout";
import { authenticate } from "~/services/authenticate";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await authenticate(request);
}

export default function ProtectLayout() {
  return (
    <>
      <Outlet />
    </>
  );
}
