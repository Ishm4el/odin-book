import { database } from "~/database/context";
import * as schema from "~/database/schema";

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
    <>
      <h1>Welcome to the homepage!</h1>
      <h2>A Brief Message From The Server: {loaderData.message}</h2>
      <h3>{JSON.stringify(loaderData.user)}</h3>
    </>
  );
}
