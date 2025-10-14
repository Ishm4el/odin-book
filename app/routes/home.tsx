import { database } from "~/database/context";
import * as schema from "~/database/schema";

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

  const db = database();
  if (user)
    try {
      const postsToDisplay = await db.query.posts.findMany({
        orderBy: (posts, { asc }) => [asc(posts.datePublished)],
        with: { authorId: { columns: { firstName: true, lastName: true } } },
      });
      return { user, postsToDisplay };
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }

  return {
    message: context.VALUE_FROM_EXPRESS,
    user: user,
  };
}

export default function Home({ actionData, loaderData }: Route.ComponentProps) {
  return (
    <>
      {loaderData.user ? (
        <section>
          <h3 className="p-1 h-fit break-words bg-gray-200/50 w-full text-center mb-10">
            {JSON.stringify(loaderData.user)}
          </h3>
          {loaderData.postsToDisplay
            ? loaderData.postsToDisplay.map((post) => (
                <article className="bg-white mb-6 shadow-2xl">
                  <div className="flex flex-col bg-amber-50 p-2">
                    <div className="flex items-end gap-1">
                      <h1 className="text-2xl text-shadow">{post.title}</h1>
                      <h2 className="text-xl">
                        {post.authorId.firstName} {post.authorId.lastName}
                      </h2>
                    </div>
                    <h3 className="text-sm">
                      {`${post.datePublished.toString()}`}{" "}
                      {post.datePublished.toString() !==
                      post.dateUpdated.toString()
                        ? post.dateUpdated.toString()
                        : null}
                    </h3>
                  </div>

                  <span className="lg p-5 block">{post.text}</span>
                </article>
              ))
            : null}
        </section>
      ) : (
        <>
          <h1 className="text-7xl text-amber-300 bg-amber-50/60 w-full text-center p-10 text-shadow-lg">
            Welcome to the homepage!
          </h1>
          <h2 className="text-5xl bg-white/50 w-full text-center">
            A Brief Message From The Server: {loaderData.message}
          </h2>
        </>
      )}
    </>
  );
}
