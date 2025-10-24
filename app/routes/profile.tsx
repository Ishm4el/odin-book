import {
  data,
  Form,
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router";

import type { Route } from "./+types/profile";

import { database } from "~/database/context";
import * as schema from "~/database/schema";

import { camelCaseToTitleCase } from "~/utility/utility";
import { authenticate } from "~/services/authenticate";
import { and, eq } from "drizzle-orm";

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
      followers: {
        with: {
          follower: {
            columns: { password: false, email: false, birthdate: false },
          },
        },
      },
    },
  });

  const userFollows = await db.query.follows.findMany({
    where: (t, { eq }) => eq(t.followerId, user.id),
    with: {
      followee: {
        columns: { password: false, email: false, birthdate: false },
      },
    },
  });

  const doesCurrentUserFollow = await db.query.follows.findFirst({
    where: (table, { eq, and }) =>
      and(eq(table.followeeId, otherUserId), eq(table.followerId, user.id)),
  });

  if (otherUserData)
    return {
      ...otherUserData,
      creationDate: otherUserData.created.toDateString(),
      doesCurrentUserFollow,
      userFollows: userFollows,
      sameUser: otherUserId === user.id,
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

  switch (request.method) {
    case "POST":
      await db
        .insert(schema.follows)
        .values({ followeeId: otherUserId, followerId: user.id });
      break;

    case "DELETE":
      await db
        .delete(schema.follows)
        .where(
          and(
            eq(schema.follows.followeeId, otherUserId),
            eq(schema.follows.followerId, user.id)
          )
        );
      break;
  }
}

function RenderListItemUser({
  followerId,
  profilePictureAddress,
  firstName,
  lastName,
}: {
  [key: string]: string;
}) {
  const navigate = useNavigate();

  return (
    <li
      className="outline text-xl p-0.5 bg-slate-50 hover:bg-white active:bg-amber-100 hover:cursor-pointer"
      onClick={() => {
        navigate(`/profile/${followerId}`);
      }}
    >
      <div className="flex items-center p-1 gap-2">
        <img
          src={profilePictureAddress}
          className="inline object-cover rounded-full border border-amber-300 hover:cursor-pointer hover:border-amber-500 size-[calc(var(--text-xl--line-height)*var(--text-xl))]"
        />
        <h4>
          {firstName} {lastName}
        </h4>
      </div>
    </li>
  );
}

export default function profile({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const {
    id,
    profilePictureAddress,
    followers,
    userFollows,
    created,
    doesCurrentUserFollow,
    sameUser,
    ...toDisplay
  } = loaderData;
  const entries = Object.entries(toDisplay);

  const descriptors = entries.map((entry) => (
    <Descriptor
      title={camelCaseToTitleCase(entry[0])}
      info={entry[1]}
      key={entry[0]}
    />
  ));

  const doesFollowDisplay = doesCurrentUserFollow ? (
    <div>{JSON.stringify(doesCurrentUserFollow, null, 2)}</div>
  ) : null;

  const userControlsRender = sameUser ? (
    <div className="md:flex md:gap-3 w-full">
      <div className="flex-1">
        <h3 className="text-2xl text-rose-900">{"Followers"}</h3>
        <ul
          className={`h-[40dvh] overflow-scroll outline ${followers.length === 0 ? "bg-gray-100" : "bg-sky-50"}`}
        >
          {followers.map((user) => (
            <>
              <RenderListItemUser
                firstName={user.follower.firstName}
                followerId={user.followerId}
                lastName={user.follower.lastName}
                profilePictureAddress={user.follower.profilePictureAddress}
              />
            </>
          ))}
        </ul>
      </div>

      <div className="flex-1">
        <h3 className="text-2xl text-rose-900">{"Followers"}</h3>
        <ul
          className={`h-[40dvh] overflow-scroll outline ${userFollows.length === 0 ? "bg-gray-100" : "bg-sky-50"}`}
        >
          {userFollows.map((user) => (
            <>
              <RenderListItemUser
                firstName={user.followee.firstName}
                followerId={user.followeeId}
                lastName={user.followee.lastName}
                profilePictureAddress={user.followee.profilePictureAddress}
              />
            </>
          ))}
        </ul>
      </div>
    </div>
  ) : (
    <Form method={doesFollowDisplay ? "DELETE" : "POST"}>
      <button
        name="userId"
        className={
          doesFollowDisplay
            ? "border rounded hover:cursor-pointer bg-linear-to-bl from-red-100 to-rose-200 hover:bg-linear-to-br hover:from-red-50 hover:to-rose-100 p-1 active:from-red-400 active:to-rose-400"
            : "border rounded hover:cursor-pointer bg-linear-to-bl from-amber-100 to-orange-200 hover:bg-linear-to-br hover:from-amber-50 hover:to-orange-100 p-1 active:from-amber-400 active:to-orange-400"
        }
      >
        {doesFollowDisplay ? "Unfollow" : "Follow"}
      </button>
    </Form>
  );

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
        {userControlsRender}
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
