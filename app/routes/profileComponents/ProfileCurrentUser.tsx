import { Form, useLoaderData, useNavigate } from "react-router";
import type { loader } from "../profile";
import { useRef, useState } from "react";

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
      className="bg-slate-50 p-0.5 text-xl outline hover:cursor-pointer hover:bg-white active:bg-amber-100"
      onClick={() => {
        navigate(`/profile/${followerId}`);
      }}
      key={`list-item-${followerId}`}
    >
      <div className="flex items-center gap-2 p-1">
        <img
          src={profilePictureAddress}
          className="inline size-[calc(var(--text-xl--line-height)*var(--text-xl))] rounded-full border border-amber-300 object-cover hover:cursor-pointer hover:border-amber-500"
        />
        <h4>
          {firstName} {lastName}
        </h4>
      </div>
    </li>
  );
}

function UserSearch({
  setInput,
}: {
  setInput: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <search>
      <form>
        <input
          type="search"
          placeholder="Search Following"
          className="my-1 border p-1"
          onInput={(e) => setInput(e.currentTarget.value)}
        />
      </form>
    </search>
  );
}

export default function ProfileCurrentUser() {
  const { followers, userFollows } = useLoaderData<typeof loader>();
  const [followersInput, setFollowersInput] = useState<string>("");
  const [followingInput, setFollowingInput] = useState<string>("");

  const usersListStyle = `h-[50dvh] overflow-y-scroll border ${userFollows.length === 0 ? "bg-gray-100" : "bg-sky-50"}`;

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
      <div className="w-full md:flex md:gap-3">
        <div className="flex-1">
          <h3 className="text-2xl text-rose-900">{"Followers"}</h3>
          <UserSearch setInput={setFollowersInput} />
          <ul className={usersListStyle}>
            {followersInput !== ""
              ? followers
                  .filter((el) => {
                    const userName =
                      el.follower.firstName + " " + el.follower.lastName;
                    if (userName.toLowerCase().includes(followersInput))
                      return true;
                    else false;
                  })
                  .map((user) => (
                    <RenderListItemUser
                      firstName={user.follower.firstName}
                      followerId={user.followerId}
                      lastName={user.follower.lastName}
                      profilePictureAddress={
                        user.follower.profilePictureAddress
                      }
                      key={`followers-${user.followerId}`}
                    />
                  ))
              : followers.map((user) => (
                  <RenderListItemUser
                    firstName={user.follower.firstName}
                    followerId={user.followerId}
                    lastName={user.follower.lastName}
                    profilePictureAddress={user.follower.profilePictureAddress}
                    key={`followers-${user.followerId}`}
                  />
                ))}
          </ul>
        </div>

        <div className="flex-1">
          <h3 className="text-2xl text-rose-900">{"Following"}</h3>
          <UserSearch setInput={setFollowingInput} />
          <ul className={usersListStyle}>
            {followingInput !== ""
              ? userFollows
                  .filter((el) => {
                    const userName =
                      el.followee.firstName + " " + el.followee.lastName;
                    if (userName.toLowerCase().includes(followingInput)) {
                      console.log("filtering");
                      return true;
                    } else return false;
                  })
                  .map((user) => (
                    <RenderListItemUser
                      firstName={user.followee.firstName}
                      followeeId={user.followerId}
                      lastName={user.followee.lastName}
                      profilePictureAddress={
                        user.followee.profilePictureAddress
                      }
                      key={`followers-${user.followerId}`}
                    />
                  ))
              : userFollows.map((user) => (
                  <RenderListItemUser
                    firstName={user.followee.firstName}
                    followerId={user.followeeId}
                    lastName={user.followee.lastName}
                    profilePictureAddress={user.followee.profilePictureAddress}
                    key={`user-follows-${user.followeeId}`}
                  />
                ))}
          </ul>
        </div>
      </div>
    </>
  );
}
