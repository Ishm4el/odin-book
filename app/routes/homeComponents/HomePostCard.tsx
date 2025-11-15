import { NavLink, useNavigate } from "react-router";
import { type loader } from "../home";
import LikeSomething from "~/components/LikeSomething";
import { useState } from "react";

type loadedData = Required<
  Pick<Awaited<ReturnType<typeof loader>>, "postsToDisplay">
>["postsToDisplay"][number];

function PostHeader({ loadedData }: { loadedData: loadedData }) {
  const navigate = useNavigate();
  return (
    <div className="flex bg-amber-100">
      <div className="flex flex-20 flex-col bg-amber-50 p-2">
        <div className="flex flex-col flex-wrap">
          <NavLink
            to={`/post/${loadedData.post.id}`}
            className="hove r:underline text-3xl text-shadow-amber-500 hover:text-amber-900"
          >
            {loadedData.post.title}
          </NavLink>
          <div
            className="flex gap-1"
            onClick={() => {
              navigate(`/profile/${loadedData.post.authorId}`);
            }}
          >
            <h2 className="w-fit text-xl hover:cursor-pointer hover:text-amber-900 active:text-amber-500">
              {loadedData.user?.firstName} {loadedData.user?.lastName}
            </h2>
            <img
              src={`/profile/${loadedData.user?.id}/avatar`}
              alt=""
              className="inline size-[calc(var(--text-xl--line-height)*var(--text-xl))] rounded-full border border-amber-300 object-cover hover:cursor-pointer hover:border-amber-500"
            />
          </div>
        </div>
        <h3 className="text-sm">
          {`${loadedData.post.datePublished.toLocaleString()}`}{" "}
          {loadedData.post.datePublished.toString() !==
          loadedData.post.dateUpdated.toString()
            ? loadedData.post.dateUpdated.toString()
            : null}
        </h3>
      </div>
      <div
        id={`comment-like-button-${loadedData.post.id}`}
        className="flex-3 items-center self-center justify-self-center md:flex-1"
      >
        <LikeSomething
          actionMatch="/post/like/"
          loaderMatch="/post/isLiked/"
          requestId={loadedData.post.id}
        />
      </div>
    </div>
  );
}

function PostCardImage({ postId }: { postId: string }) {
  const [shouldExpandImage, setShouldExpandImage] = useState<boolean>(false);
  return (
    <div className="bg-gray/10 flex justify-center bg-sky-100/50 p-3">
      <img
        src={`/post/${postId}/image`}
        alt=""
        className={`object-scale-down shadow hover:cursor-pointer ${shouldExpandImage ? "size-[50dvh]" : "size-[25dvh]"}`}
        onClick={() => setShouldExpandImage(!shouldExpandImage)}
      />
    </div>
  );
}

export function PostCard({ loadedData }: { loadedData: loadedData }) {
  const postCardImage = loadedData.post.hasImage ? (
    <PostCardImage postId={loadedData.post.id} />
  ) : null;
  return (
    <article className="mb-6 shadow-xl">
      <PostHeader loadedData={loadedData} />
      {postCardImage}
      <span className="block bg-sky-50/99 p-5">{loadedData.post.text}</span>
    </article>
  );
}
