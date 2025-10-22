import { data } from "react-router";

import type { Route } from "./+types/otherUserProfile";

import { database } from "~/database/context";
import * as schema from "~/database/schema";

import { camelCaseToTitleCase } from "~/utility/utility";

export async function loader({ params }: Route.LoaderArgs) {
  const otherUserId = params.profileId;

  const db = database();

  const otherUserData = await db.query.users.findFirst({
    where: (t, { eq }) => eq(t.id, otherUserId),
    columns: { password: false, birthdate: false, email: false },
  });

  if (otherUserData)
    return {
      "creationDate": otherUserData.created.toDateString(),
      ...otherUserData,
    };
  throw data("User not found", { status: 404 });
}

function Descriptor({ title, info }: { title: string; info: string }) {
  return (
    <div>
      <h2>{title}: </h2>
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
    <article>
      <section id="other-user-header">
        <h1>{loaderData.firstName}</h1>
        <img src={loaderData.profilePictureAddress} alt="" />
      </section>
      <section id="other-user-info">{descriptors}</section>
    </article>
  );
}
