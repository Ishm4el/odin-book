import { Form, data, redirect } from "react-router";
import { authenticator, sessionStorage } from "~/services/auth.server";

import type { Route } from "./+types/login";
import FormSmallCard from "~/components/FormSmallCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Loging In" },
    { name: "description", content: "Logging In!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await sessionStorage.getSession(
    request.headers.get("cookie"),
  );
  const user = session.get("user");

  if (user) return redirect("/");

  return null;
}

export async function action({ request }: Route.ActionArgs) {
  try {
    const user = await authenticator.authenticate("user-pass", request);

    const session = await sessionStorage.getSession(
      request.headers.get("cookie"),
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
    <FormSmallCard title="Login">
      {actionData?.error ? (
        <div className="error">{actionData.error}</div>
      ) : null}
      <Form
        method="post"
        className="mb-4 rounded bg-white px-8 pt-6 pb-8 dark:bg-gray-700"
      >
        <div className="mb-4">
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="focus:shadow-outline mb-3 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow invalid:border-pink-500 invalid:text-pink-600 focus:border-sky-500 focus:outline-none dark:bg-gray-600 dark:text-gray-200 dark:invalid:text-red-500"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <input
            required
            type="password"
            name="password"
            id="password"
            className="focus:shadow-outline mb-3 w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:border-sky-500 focus:outline-none dark:bg-gray-600 dark:text-gray-300"
          />
        </div>

        <button
          type="submit"
          className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:cursor-pointer hover:bg-blue-700 focus:outline-none dark:text-gray-100"
        >
          Sign In
        </button>
      </Form>
    </FormSmallCard>
  );
}
