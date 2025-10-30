import { Form, useLoaderData, useNavigate } from "react-router";
import type { loader } from "../profile";
import { useState } from "react";
import SearchForm from "~/components/SearchForm";

type LoaderData = Awaited<ReturnType<typeof loader>>;
type FollowersFollowingRow = Pick<LoaderData, "followers" | "userFollows">;
type UserInfo = LoaderData["userFollows"][number]["followee"];

function RenderListItemUser(user: UserInfo) {
  const navigate = useNavigate();
  return (
    <li
      className="bg-slate-50 p-0.5 text-xl outline hover:cursor-pointer hover:bg-white active:bg-amber-100"
      onClick={() => {
        navigate(`/profile/${user.id}`);
      }}
      key={`list-item-${user.id}`}
    >
      <div className="flex items-center gap-2 p-1">
        <img
          src={user.profilePictureAddress}
          className="inline size-[calc(var(--text-xl--line-height)*var(--text-xl))] rounded-full border border-amber-300 object-cover hover:cursor-pointer hover:border-amber-500"
        />
        <h4>{`${user.firstName} ${user.lastName}`}</h4>
      </div>
    </li>
  );
}

function UserCard({ users, title }: { users: UserInfo[]; title: string }) {
  const [followersInput, setFollowersInput] = useState<string>("");
  return (
    <div className="flex-1">
      <h3 className="text-2xl text-rose-900">{title}</h3>
      <SearchForm setInput={setFollowersInput} />
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
                <RenderListItemUser
                  firstName={user.firstName}
                  id={user.id}
                  lastName={user.lastName}
                  profilePictureAddress={user.profilePictureAddress}
                  key={`followers-${user.id}`}
                  created={user.created}
                />
              ))
          : users.map((user) => (
              <RenderListItemUser
                firstName={user.firstName}
                id={user.id}
                lastName={user.lastName}
                profilePictureAddress={user.profilePictureAddress}
                key={`followers-${user.id}`}
                created={user.created}
              />
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
          profilePictureAddress: e.follower.profilePictureAddress,
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
          profilePictureAddress: e.followee.profilePictureAddress,
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
        <button className="focus:ring-opacity-75 transform rounded-full bg-gradient-to-r from-amber-500 to-sky-500 px-8 py-3 font-bold text-white transition-all duration-300 ease-in-out hover:scale-105 hover:cursor-pointer hover:from-amber-600 hover:to-sky-600 hover:shadow-lg focus:ring-2 focus:ring-purple-400 focus:outline-none">
          Update New Profile Picture
        </button>
      </Form>
      <FollowingFollowers followers={followers} userFollows={userFollows} />
    </>
  );
}
