import { NavLink, useNavigate } from "react-router";
import { type loader } from "../home";
import LikeSomething from "~/components/LikeSomething";

type loadedData = Required<
  Pick<Awaited<ReturnType<typeof loader>>, "postsToDisplay">
>["postsToDisplay"][number];

function PostHeader({ loadedData }: { loadedData: loadedData }) {
  const navigate = useNavigate();
  return (
    <div className="flex">
      <div className="flex flex-20 flex-col bg-amber-50 p-2">
        <div className="flex flex-wrap items-end gap-5">
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
          {`${loadedData.post.datePublished.toString()}`}{" "}
          {loadedData.post.datePublished.toString() !==
          loadedData.post.dateUpdated.toString()
            ? loadedData.post.dateUpdated.toString()
            : null}
        </h3>
      </div>
      <div
        id={`comment-like-button-${loadedData.post.id}`}
        className="flex-1 items-center self-center justify-self-center bg-amber-100"
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

export function PostCard({ loadedData }: { loadedData: loadedData }) {
  return (
    <article className="mb-6 bg-white shadow-xl">
      <PostHeader loadedData={loadedData} />
      <div className="flex justify-center p-3">
        {loadedData.post.hasImage && (
          <img
            src={`/post/${loadedData.post.id}/image`}
            alt=""
            className="size-[25dvh] object-scale-down"
          />
        )}
      </div>
      <span className="block p-5">{loadedData.post.text}</span>
    </article>
  );
}
