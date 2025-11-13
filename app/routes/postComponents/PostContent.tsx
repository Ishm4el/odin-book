import { useLoaderData, useNavigate } from "react-router";
import type { loader } from "../post";
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
        <div id="post-header" className="bg-amber-100/99">
          <h1 className="p-2 text-4xl">{loaderData.post.title}</h1>
          <div id="post-header-author-section" className="flex gap-2 p-2">
            <h2
              className="w-fit text-xl hover:cursor-pointer hover:text-amber-900 active:text-amber-500"
              onClick={() => {
                navigate(`/profile/${loaderData.post?.authorId.id}`);
              }}
            >
              {loaderData.post.authorId.lastName},{" "}
              {loaderData.post.authorId.firstName}
            </h2>
            <UserProfilePicture
              src={`/profile/${loaderData.post.authorId.id}/avatar`}
              textSize={"xl"}
            />
          </div>
        </div>
        {loaderData.post.hasImage && (
          <div className="bg-gray/10 flex justify-center bg-sky-100/50 p-3">
            <img
              src={`/post/${loaderData.post.id}/image`}
              alt=""
              className={`object-scale-down shadow hover:cursor-pointer ${shouldExpandImage ? "size-[80dvh]" : "size-[50dvh]"}`}
              onClick={() => setShouldExpandImage(!shouldExpandImage)}
            />
          </div>
        )}
        <div id="post-text" className="p-4 bg-white">
          {loaderData.post.text}
        </div>
        <div
          id={`comment-like-button-${loaderData.post.id}`}
          className="flex justify-center border-b-2 p-2 bg-amber-100"
        >
          <div className="size-[var(--base-size-h)] [--base-size-h:calc(var(--text-base--line-height)*var(--text-base))]">
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
