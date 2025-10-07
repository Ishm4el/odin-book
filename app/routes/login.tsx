import { Form, data, redirect } from "react-router";
import { authenticator, sessionStorage } from "~/services/auth.server";

import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Loging In" },
    { name: "description", content: "Logging In!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie")
  );
  const user = session.get("user");

  if (user) return redirect("/");

  return null;
}

export async function action({ request }: Route.ActionArgs) {
  try {
    const user = await authenticator.authenticate("user-pass", request);

    const session = await sessionStorage.getSession(
      request.headers.get("cookie")
    );

    session.set("user", user);

    return redirect("/", {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else throw error;
  }
}

export default function Component({ actionData }: Route.ComponentProps) {
  return (
    <main className="flex justify-center h-[calc(100vh-4rem)]">
      <div className="max-w-xs shadow-md rounded overflow-hidden h-min mt-[10cqh]">
        <h2 className="text-2xl text-center text-amber-300 text-shadow-sm bg-blue-900 p-2">
          Login
        </h2>

        {actionData?.error ? (
          <div className="error">{actionData.error}</div>
        ) : null}

        <Form method="post" className="bg-white rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:cursor-pointer"
          >
            Sign In
          </button>
        </Form>
      </div>
    </main>
  );
}
