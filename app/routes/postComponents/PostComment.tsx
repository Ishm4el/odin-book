import { Form, useActionData, useLoaderData, useNavigate } from "react-router";
import type { loader, action } from "../post";
import UserProfilePicture from "~/components/UserProfilePicture";
import LikeSomething from "~/components/LikeSomething";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";

export default function PostComment() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();

  const refForm = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (actionData?.error) {
      toast.error(JSON.stringify(actionData.error));
    } else if (actionData?.res && refForm.current) {
      refForm.current.reset();
      toast.success(JSON.stringify(actionData.res));
    }
  }, [actionData]);

  if (loaderData && loaderData.post) {
    return (
      <section id="post-comments" className="bg-white">
        <Form
          method="post"
          className="mb-3 flex flex-col gap-3 p-1 shadow"
          ref={refForm}
        >
          <div className="flex flex-col">
            <label htmlFor="newComment" className="mb-1 text-center underline">
              Comment?
            </label>
            <textarea
              name="newComment"
              id="newComment"
              className="mx-3 ring"
            ></textarea>
          </div>
          <button
            type="submit"
            className="mb-1 w-1/2 self-center rounded border bg-orange-50 hover:cursor-pointer hover:bg-orange-100 focus:bg-orange-100"
          >
            Post Comment
          </button>
        </Form>

        <ul id="post-comment-section">
          {loaderData.post.comments.map((comment) => (
            <li className="mb-1 p-1 shadow" key={comment.id}>
              <div className="flex gap-2 bg-amber-50/90">
                <div
                  className="flex gap-1"
                  onClick={() => {
                    navigate(`/profile/${comment.authorId.id}`);
                  }}
                >
                  <h2 className="w-fit hover:cursor-pointer hover:text-amber-900 active:text-amber-500">
                    {comment.authorId.firstName} {comment.authorId.lastName}
                  </h2>
                  <img
                    src={`/profile/${comment.authorId}/avatar`}
                    alt=""
                    className="inline size-[calc(var(--text-base--line-height)*var(--text-base))] rounded-full border border-amber-300 object-cover hover:cursor-pointer hover:border-amber-500"
                  />
                </div>
                <h3>{comment.datePublished.toDateString()}</h3>
              </div>
              <div>{comment.text}</div>
              <div id={`comment-controls-${comment.id}`}>
                <div
                  id={`comment-like-button-${comment.id}`}
                  className="size-[var(--base-size-h)] [--base-size-h:calc(var(--text-base--line-height)*var(--text-base))]"
                >
                  <LikeSomething
                    actionMatch={`/comment/like/`}
                    loaderMatch="/comment/isLiked/"
                    requestId={comment.id}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    );
  }
}
