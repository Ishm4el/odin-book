import { data, isRouteErrorResponse, useRouteError } from "react-router";

import type { Route } from "./+types/profile";

import { database } from "~/database/context";
import * as schema from "~/database/schema";

import { camelCaseToTitleCase } from "~/utility/utility";
import { authenticate } from "~/services/authenticate";
import { and, eq } from "drizzle-orm";

import { type FileUpload, parseFormData } from "@remix-run/form-data-parser";

import { fileStorage, getStorageKey } from "~/services/avatar-storage.server";
import ProfileCurrentUser from "./profileComponents/ProfileCurrentUser";
import ProfileOtherUser from "./profileComponents/ProfileOtherUser";

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

export async function action({ request, params }: Route.ActionArgs) {
  const user = await authenticate(request);
  const otherUserId = params.profileId;

  const checkIfSameUser = () => {
    if (user.id === otherUserId)
      throw data("You cannot follow yourself", { status: 409 });
  };

  const db = database();

  switch (request.method) {
    case "POST":
      checkIfSameUser();
      await db
        .insert(schema.follows)
        .values({ followeeId: otherUserId, followerId: user.id });
      break;

    case "DELETE":
      checkIfSameUser();
      await db
        .delete(schema.follows)
        .where(
          and(
            eq(schema.follows.followeeId, otherUserId),
            eq(schema.follows.followerId, user.id),
          ),
        );
      break;
    case "PATCH":
      console.log("PATCHING");
      async function uploadHandler(fileUpload: FileUpload) {
        if (
          fileUpload.fieldName === "avatar" &&
          fileUpload.type.startsWith("image/")
        ) {
          console.log("file is uploading");
          const storageKey = getStorageKey(user.id);
          console.log(storageKey);
          await fileStorage.set(storageKey, fileUpload);

          const fileFromStorage = await fileStorage.get(storageKey);

          if (fileFromStorage) console.log(fileFromStorage.name);
        }
      }

      // let storage = new LocalFileStorage(".");

      // let file = new File(["hello world"], "hello.txt", { type: "text/plain" });
      // let key = "hello-key";

      // Put the file in storage.
      // await storage.set(key, file);

      const formData = await parseFormData(request, uploadHandler);
      // const image = formData.get("avatar");

      break;
  }
}

function Descriptor({ title, info }: { title: string; info: string }) {
  return (
    <div className="flex gap-2">
      <h2 className="font-medium text-orange-950">{title}: </h2>
      <span>{info}</span>
    </div>
  );
}

export default function profile({ loaderData }: Route.ComponentProps) {
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

  return (
    <article className="w-full p-5">
      <section
        id="other-user-header"
        className="flex w-full items-center gap-2 bg-amber-50 p-2 text-4xl font-semibold"
      >
        <h1>
          {loaderData.firstName} {loaderData.lastName}
        </h1>
        <img
          src={loaderData.profilePictureAddress}
          alt=""
          className="inline size-[40px] rounded-full border border-amber-300 object-cover hover:cursor-pointer hover:border-amber-500"
        />
      </section>
      <section id="other-user-info" className="bg-white p-2 text-lg">
        {entries.map((entry) => (
          <Descriptor
            title={camelCaseToTitleCase(entry[0])}
            info={entry[1]}
            key={`data-point-${entry[0]}`}
          />
        ))}
      </section>
      <section id="user-controls" className="bg-white p-2">
        {sameUser ? <ProfileCurrentUser /> : <ProfileOtherUser />}
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
        <h1 className="text-2xl font-bold">
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
