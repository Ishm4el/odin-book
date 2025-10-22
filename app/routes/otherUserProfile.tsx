import { data, Form } from "react-router";

import type { Route } from "./+types/otherUserProfile";

import { database } from "~/database/context";
import * as schema from "~/database/schema";

import { camelCaseToTitleCase } from "~/utility/utility";

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    { title: `Viewing User: ${loaderData.id}` },
    { name: "description", content: "Display a user" },
  ];
}

export async function loader({ params }: Route.LoaderArgs) {
  const otherUserId = params.profileId;

  const db = database();

  const otherUserData = await db.query.users.findFirst({
    where: (t, { eq }) => eq(t.id, otherUserId),
    columns: { password: false, birthdate: false, email: false },
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

export default function otherUserProfile({ loaderData }: Route.ComponentProps) {
  const { id, profilePictureAddress, created, ...toDisplay } = loaderData;
  const entries = Object.entries(toDisplay);

  const descriptors = entries.map((entry) => (
    <Descriptor
      title={camelCaseToTitleCase(entry[0])}
      info={entry[1]}
      key={entry[0]}
    />
  ));

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
            Send Friend Request
          </button>
        </Form>
      </section>
    </article>
  );
}
