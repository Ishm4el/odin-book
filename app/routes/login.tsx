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
    <div>
      <h1>Login</h1>

      {actionData?.error ? (
        <div className="error">{actionData.error}</div>
      ) : null}

      <Form method="post">
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" />
        </div>

        <button type="submit">Sign In</button>
      </Form>
    </div>
  );
}
