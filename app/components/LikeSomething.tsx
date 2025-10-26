import { useEffect } from "react";
import { useFetcher } from "react-router";

interface LikeSomething {
  requestId: string;
  actionMatch: string;
  loaderMatch: string;
}

export default function LikeSomething({
  requestId,
  actionMatch,
  loaderMatch,
}: LikeSomething) {
  const fetcher = useFetcher();

  const fetcherLoader = useFetcher<{ like: boolean }>();

  useEffect(() => {
    fetcherLoader.load(loaderMatch + requestId);
  }, []);

  return (
    <fetcher.Form
      method="post"
      action={`${actionMatch}${requestId}`}
      className="size-[var(--base-size-h)]"
    >
      <button
        type="submit"
        className="hover:cursor-pointer w-full"
        name="shouldLike"
        value={fetcherLoader.data?.like ? "false" : "true"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className={
            fetcherLoader.data?.like
              ? "fill-amber-500 hover:fill-amber-100"
              : "hover:fill-amber-400"
          }
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
      </button>
    </fetcher.Form>
  );
}
