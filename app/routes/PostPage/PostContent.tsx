import { useLoaderData, useNavigate } from "react-router";
import type { loader } from "./index";
import UserProfilePicture from "~/components/UserProfilePicture";
import LikeSomething from "~/components/LikeSomething";
import { useState } from "react";

export default function PostContent() {
  const [shouldExpandImage, setShouldExpandImage] = useState<boolean>(false);
  const loaderData = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  if (loaderData && loaderData.post)
    return (
      <section id="post-content">
        <div
          id="post-header"
          className="flex flex-col gap-1 bg-amber-100/99 p-2 dark:bg-amber-900/99"
        >
          <h1 className="text-shadow-xl text-4xl">{loaderData.post.title}</h1>
          <div
            id="post-header-author-section"
            className="flex h-7 items-center gap-1"
          >
            <h2
              className="inline text-xl hover:cursor-pointer hover:text-amber-900 active:text-amber-500 dark:hover:text-amber-100"
              onClick={() => {
                navigate(`/profile/${loaderData.post?.authorId.id}`);
              }}
            >
              {`${loaderData.post.authorId.lastName} ${loaderData.post.authorId.firstName}`}
            </h2>
            <UserProfilePicture
              src={`/profile/${loaderData.post.authorId.id}/avatar`}
              className="self-stretch"
            />
          </div>
          <h3>{loaderData.post.datePublished.toLocaleString()}</h3>
        </div>
        {loaderData.post.hasImage && (
          <div className="bg-gray/10 flex justify-center bg-sky-100/50 p-3 dark:bg-sky-900/50">
            <img
              src={`/post/${loaderData.post.id}/image`}
              alt=""
              className={`object-scale-down shadow hover:cursor-pointer ${shouldExpandImage ? "size-[80dvh]" : "size-[50dvh]"}`}
              onClick={() => setShouldExpandImage(!shouldExpandImage)}
            />
          </div>
        )}
        <div id="post-text" className="bg-white p-4 dark:bg-gray-950">
          {loaderData.post.text}
        </div>
        <div
          id={`comment-like-button-${loaderData.post.id}`}
          className="flex justify-center border-b-2 bg-amber-100 p-2 dark:border-gray-500 dark:bg-amber-900"
        >
          <div className="size-[var(--base-size-h)] [--base-size-h:calc(var(--text-3xl--line-height)*var(--text-3xl))]">
            <LikeSomething
              actionMatch={`/post/like/`}
              loaderMatch="/post/isLiked/"
              requestId={loaderData.post.id}
            />
          </div>
        </div>
      </section>
    );
}
