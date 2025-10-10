import type { Route } from "./+types/home";

import { sessionStorage } from "~/services/auth.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
    {},
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
    <>
      <h1 className="text-7xl text-amber-300 bg-amber-50/60 w-full text-center p-10 text-shadow-lg">
        Welcome to the homepage!
      </h1>
      <h2 className="text-5xl bg-white/50 w-full text-center">
        A Brief Message From The Server: {loaderData.message}
      </h2>
      <h3 className="p-1 h-fit break-words bg-gray-200/50 w-full text-center">
        {JSON.stringify(loaderData.user)}
      </h3>
    </>
  );
}
