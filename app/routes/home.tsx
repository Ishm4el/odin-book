import type { Route } from "./+types/home";

import { sessionStorage } from "~/services/auth.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ context, request }: Route.LoaderArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const user = session.get("user");

  return {
    message: context.VALUE_FROM_EXPRESS,
    user: user,
  };
}

export default function Home({ actionData, loaderData }: Route.ComponentProps) {
  return (
    <main className="flex flex-col justify-items-center text-center gap-2.5">
      <h1 className="text-7xl text-amber-300 bg-amber-50">Welcome to the homepage!</h1>
      <h2 className="text-5xl">A Brief Message From The Server: {loaderData.message}</h2>
      <h3>{JSON.stringify(loaderData.user)}</h3>
    </main>
  );
}
