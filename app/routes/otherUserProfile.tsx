import { data, Form, isRouteErrorResponse, useRouteError } from "react-router";

import type { Route } from "./+types/otherUserProfile";

import { database } from "~/database/context";
import * as schema from "~/database/schema";

import { camelCaseToTitleCase } from "~/utility/utility";
import { authenticate } from "~/services/authenticate";

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    { title: `Viewing User: ${loaderData ? loaderData.id : "ERROR"}` },
    { name: "description", content: "Display a user" },
  ];
}

export async function loader({ params, request }: Route.LoaderArgs) {
  const otherUserId = params.profileId;
  const user = await authenticate(request);

  const db = database();

  const otherUserData = await db.query.users.findFirst({
    where: (t, { eq }) => eq(t.id, otherUserId),
    columns: { password: false, birthdate: false, email: false },
    with: {
      followers: { where: (table, { eq }) => eq(table.followerId, user.id) },
    },
  });

  if (otherUserData)
    return {
      ...otherUserData,
      creationDate: otherUserData.created.toDateString(),
    };
  throw data("User not found", { status: 404 });
}

function Descriptor({ title, info }: { title: string; info: string }) {
  return (
    <div className="flex gap-2">
      <h2 className="font-medium text-orange-950">{title}: </h2>
      <span>{info}</span>
    </div>
  );
}

export async function action({ request, params }: Route.ActionArgs) {
  const user = await authenticate(request);
  const otherUserId = params.profileId;

  if (user.id === otherUserId)
    throw data("You cannot follow yourself", { status: 409 });

  const db = database();

  await db
    .insert(schema.follows)
    .values({ followeeId: otherUserId, followerId: user.id });
}

export default function otherUserProfile({ loaderData }: Route.ComponentProps) {
  const { id, profilePictureAddress, followers, created, ...toDisplay } =
    loaderData;
  const entries = Object.entries(toDisplay);

  const descriptors = entries.map((entry) => (
    <Descriptor
      title={camelCaseToTitleCase(entry[0])}
      info={entry[1]}
      key={entry[0]}
    />
  ));

  const doesFollowDisplay =
    followers.length > 0 ? (
      <div>{JSON.stringify(followers[0], null, 2)}</div>
    ) : null;

  return (
    <article className="bg-white w-full">
      <section
        id="other-user-header"
        className="items-center text-4xl w-full flex gap-2 bg-amber-50 p-2 font-semibold"
      >
        <h1>
          {loaderData.firstName} {loaderData.lastName}
        </h1>
        <img
          src={loaderData.profilePictureAddress}
          alt=""
          className="inline object-cover rounded-full border border-amber-300 hover:cursor-pointer hover:border-amber-500 size-[40px]"
        />
      </section>
      <section id="other-user-info" className="p-2 text-lg">
        {descriptors}
      </section>
      <section id="user-controls" className="bg-white p-2">
        <Form method="POST">
          <button
            name="userId"
            className="border rounded hover:cursor-pointer bg-linear-to-bl from-amber-100 to-orange-200 hover:bg-linear-to-br hover:from-amber-50 hover:to-orange-100 p-1 active:from-amber-400 active:to-orange-400"
          >
            Follow
          </button>
        </Form>
        {doesFollowDisplay}
      </section>
    </article>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  const containerClass: React.ComponentProps<"div">["className"] =
    "bg-white w-full h-full flex flex-col justify-center items-center";

  if (isRouteErrorResponse(error)) {
    return (
      <div className={containerClass}>
        <h1 className="font-bold text-2xl">
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div className={containerClass}>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
