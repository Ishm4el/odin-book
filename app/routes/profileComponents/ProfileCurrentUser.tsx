import { Form, useLoaderData } from "react-router";
import type { loader } from "../profile";
import { useState } from "react";
import SearchForm from "~/components/SearchForm";
import SectionTitle from "./SectionTitle";
import ListItemNavigation from "./ListItemNavigation";
import UserProfilePicture from "~/components/UserProfilePicture";

type LoaderData = Awaited<ReturnType<typeof loader>>;
type FollowersFollowingRow = Pick<LoaderData, "followers" | "userFollows">;
type UserInfo = LoaderData["userFollows"][number]["followee"];

function UserCard({ users, title }: { users: UserInfo[]; title: string }) {
  const [followersInput, setFollowersInput] = useState<string>("");
  return (
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <SectionTitle title={title} />
        <SearchForm setInput={setFollowersInput} />
      </div>
      <ul
        className={`h-[50dvh] overflow-y-scroll border ${users.length === 0 ? "bg-gray-100" : "bg-sky-50"}`}
      >
        {followersInput !== ""
          ? users
              .filter((el) => {
                const userName = el.firstName + " " + el.lastName;
                if (userName.toLowerCase().includes(followersInput))
                  return true;
                else false;
              })
              .map((user) => (
                <ListItemNavigation
                  onClickLink={`/user/${user.id}`}
                  key={`${title}-${user.id}-item-filtered`}
                >
                  <UserProfilePicture src={`/profile/${user.id}/avatar`} />
                  <h4>{`${user.firstName} ${user.lastName}`}</h4>
                </ListItemNavigation>
              ))
          : users.map((user) => (
              <ListItemNavigation
                onClickLink={`/user/${user.id}`}
                key={`${title}-${user.id}-item`}
              >
                <UserProfilePicture src={`/profile/${user.id}/avatar`} />
                <h4>{`${user.firstName} ${user.lastName}`}</h4>
              </ListItemNavigation>
            ))}
      </ul>
    </div>
  );
}

function FollowingFollowers({ followers, userFollows }: FollowersFollowingRow) {
  return (
    <div className="w-full md:flex md:gap-3">
      <UserCard
        title="Followers"
        users={followers.map((e) => ({
          id: e.follower.id,
          firstName: e.follower.firstName,
          lastName: e.follower.lastName,
          created: e.follower.created,
        }))}
      />
      <UserCard
        title="Following"
        users={userFollows.map((e) => ({
          id: e.followee.id,
          created: e.followee.created,
          firstName: e.followee.firstName,
          lastName: e.followee.lastName,
        }))}
      />
    </div>
  );
}

export default function ProfileCurrentUser() {
  const { followers, userFollows } = useLoaderData<typeof loader>();
  return (
    <>
      <Form method="PATCH" encType="multipart/form-data">
        <input
          type="file"
          id="avatar"
          name="avatar"
          accept="image/*"
          className="text-sm text-gray-700 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:cursor-pointer hover:file:bg-violet-100"
        />
        <button className="focus:ring-opacity-75 transform rounded-full bg-gradient-to-r from-amber-500 to-sky-500 px-4 py-2 font-bold text-white transition-all duration-300 ease-in-out hover:scale-105 hover:cursor-pointer hover:from-amber-600 hover:to-sky-600 hover:shadow-lg focus:ring-2 focus:ring-purple-400 focus:outline-none">
          Update New Profile Picture
        </button>
      </Form>
      <FollowingFollowers followers={followers} userFollows={userFollows} />
    </>
  );
}
