import { Form, useNavigate } from "react-router";
import type { Route } from "./+types/index";
import UserProfilePicture from "~/components/UserProfilePicture";

import { authenticate } from "~/services/authenticate";

import { database } from "~/database/context";
import * as schema from "~/database/schema";
import { ilike, sql } from "drizzle-orm";

export async function action({ request }: Route.ActionArgs) {
  console.log("in action");
  const user = authenticate(request);
  const formData = await request.formData();
  const searchQuery = `%${String(formData.get("search-user"))}%`;

  const db = database();
  const name = sql<string>`concat(${schema.users.firstName}, ' ', ${schema.users.lastName})`;
  return await db
    .select({
      id: schema.users.id,
      name,
    })
    .from(schema.users)
    .where(ilike(name, searchQuery));
}

export default function Component({ actionData }: Route.ComponentProps) {
  const navigate = useNavigate();
  return (
    <section className="w-full bg-amber-50 dark:bg-amber-950">
      <search role="search">
        <Form method="post" className="flex flex-col items-center gap-3 p-5">
          <label
            htmlFor="search-user"
            className="text-shadow text-center text-3xl text-amber-500 dark:text-amber-400"
          >
            Search User:
          </label>
          <input
            placeholder="Enter a username"
            type="text"
            name="search-user"
            id="search-user"
            className="border bg-slate-100 p-1 hover:bg-slate-50 focus:bg-white active:bg-sky-50 dark:bg-slate-900 dark:hover:bg-slate-950 dark:focus:bg-black dark:active:bg-sky-950"
          />
          <button
            type="submit"
            className="rounded-full border bg-white p-2 px-5 text-slate-900 transition-colors hover:cursor-pointer hover:bg-sky-50 hover:text-black active:bg-sky-100 dark:bg-black dark:text-slate-100 dark:hover:bg-sky-950 dark:hover:text-white dark:active:bg-sky-900"
          >
            Search
          </button>
        </Form>
      </search>
      {actionData && actionData.length !== 0 ? (
        <ul className="flex flex-col gap-2 border-10 border-amber-50 bg-amber-100 p-5 dark:border-amber-950 dark:bg-amber-900">
          {actionData.map((e) => (
            <li
              key={e.id}
              className="flex items-center gap-1 p-5 text-xl hover:cursor-pointer hover:bg-sky-50 focus:bg-sky-50 active:bg-sky-200 dark:hover:bg-sky-950 dark:focus:bg-sky-950 dark:active:bg-sky-800"
              tabIndex={0}
              onClick={() => navigate(`/profile/${e.id}`)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ")
                  navigate(`/profile/${e.id}`);
              }}
            >
              <UserProfilePicture
                src={`/profile/${e.id}/avatar`}
                textSize="xl"
              />
              <span>{e.name}</span>
            </li>
          ))}
        </ul>
      ) : (
        <article className="p-5">
          <p className="text-center">No users were found</p>
        </article>
      )}
    </section>
  );
}
