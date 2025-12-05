import { NavLink, useFetcher, useNavigate } from "react-router";
import NavigationLink from "./NavigationLink";
import type { loader } from "app/api/isAuthenticated";
import { useEffect, useState } from "react";

type NavigationElement = { title: string; to: string };

const navigationListSets: Record<
  "unauthenticated" | "authenticated",
  NavigationElement[]
> = {
  unauthenticated: [
    { title: "Home", to: "/" },
    { title: "Login", to: "/login" },
    { title: "Sign Up", to: "/signUp" },
  ],
  authenticated: [
    { title: "Home", to: "/" },
    { title: "Post", to: "/post/create" },
    { title: "Users", to: "/profile/search" },
    { title: "Logout", to: "/logout" },
  ],
};

export default function NavBar() {
  const navigate = useNavigate();
  const fetcher = useFetcher<typeof loader>();
  const [navigationList, setNavigationList] = useState<
    (typeof navigationListSets)[keyof typeof navigationListSets]
  >(navigationListSets.unauthenticated);

  useEffect(() => {
    if (!fetcher.data && fetcher.state === "idle")
      fetcher.load("/isAuthenticated");
    else
      fetcher.data && fetcher.data.user
        ? setNavigationList(navigationListSets.authenticated)
        : setNavigationList(navigationListSets.unauthenticated);
  }, [fetcher]);

  return (
    <nav className="flex h-10 w-full bg-linear-to-b from-sky-50 to-amber-50 md:h-dvh md:w-fit md:flex-col md:px-2 md:pt-5 dark:from-sky-950 dark:to-amber-950">
      <div className="flex w-1/3 items-center justify-center md:w-full">
        <NavLink
          to={"/"}
          className={
            "text-center text-nowrap text-amber-300 transition-colors text-shadow-md hover:text-amber-400"
          }
        >
          ODIN BOOK
        </NavLink>
      </div>
      <menu className="flex w-2/3 items-center justify-around md:w-full md:flex-col">
        {navigationList.map((navigationElement) => (
          <li key={navigationElement.title}>
            <NavigationLink
              title={navigationElement.title}
              to={navigationElement.to}
            />
          </li>
        ))}
        {fetcher.data && fetcher.data.user && (
          <li
            className="flex items-center gap-1 self-center justify-self-center text-lg font-medium"
            onClick={() => {
              if (fetcher.data && fetcher.data.user) {
                navigate(`/profile/${fetcher.data.user.id}`);
              }
            }}
          >
            <span className="text-shadow text-orange-300 hover:cursor-pointer hover:text-orange-400 active:text-amber-600">
              {fetcher.data.user.firstName + " " + fetcher.data.user.lastName}
            </span>
            <img
              src={`/profile/${fetcher.data.user.id}/avatar`}
              alt="User Avatar"
              className="inline size-[calc(var(--text-xl--line-height)*var(--text-xl))] rounded-full border border-amber-300 object-cover hover:cursor-pointer hover:border-amber-500 active:border-amber-600"
            />
          </li>
        )}
      </menu>
    </nav>
  );
}
