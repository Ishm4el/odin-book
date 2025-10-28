import { useLoaderData, useNavigate } from "react-router";
import type { loader } from "../post";
import UserProfilePicture from "~/components/UserProfilePicture";
import LikeSomething from "~/components/LikeSomething";

export default function PostContent() {
  const loaderData = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  if (loaderData && loaderData.post)
    return (
      <section id="post-content" className="bg-white">
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
              src={loaderData.post.authorId.profilePictureAddress}
              textSize={"xl"}
            />
          </div>
        </div>
        <div id="post-text" className="p-4">
          {loaderData.post.text}
        </div>
        <div id={`comment-like-button-${loaderData.post.id}`} className="flex justify-center border-b-2 p-2">
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
