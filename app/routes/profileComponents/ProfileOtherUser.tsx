import { Form, useLoaderData } from "react-router";
import type { loader } from "../profile";

export default function ProfileOtherUser() {
  const { doesCurrentUserFollow } = useLoaderData<typeof loader>();

  const doesFollowDisplay = doesCurrentUserFollow ? (
    <div>{JSON.stringify(doesCurrentUserFollow, null, 2)}</div>
  ) : null;

  return (
    <Form method={doesFollowDisplay ? "DELETE" : "POST"}>
      <button
        name="userId"
        className={
          doesFollowDisplay
            ? "rounded border bg-linear-to-bl from-red-100 to-rose-200 p-1 hover:cursor-pointer hover:bg-linear-to-br hover:from-red-50 hover:to-rose-100 active:from-red-400 active:to-rose-400 dark:from-red-800 dark:to-rose-900 dark:hover:from-red-700 dark:hover:to-rose-800 dark:active:from-red-900 dark:active:to-rose-950"
            : "dark:to-orange rounded border bg-linear-to-bl from-amber-100 to-orange-200 p-1 hover:cursor-pointer hover:bg-linear-to-br hover:from-amber-50 hover:to-orange-100 active:from-amber-400 active:to-orange-400 dark:from-amber-900 dark:to-orange-800 dark:hover:from-amber-800 dark:hover:to-orange-700 dark:active:from-amber-950 dark:active:to-orange-900"
        }
      >
        {doesFollowDisplay ? "Unfollow" : "Follow"}
      </button>
    </Form>
  );
}
