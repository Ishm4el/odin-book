import { NavLink, useFetcher, useNavigate } from "react-router";
import NavigationLink from "./NavigationLink";
import type { loader } from "app/api/isAuthenticated";
import { useEffect, useState } from "react";
import useClickOutside from "./useClickOutside";

// icons
import homeIcon from "/home.svg";
import loginIcon from "/log-in.svg";
import logoutIcon from "/log-out.svg";
import postIcon from "/message-square.svg";
import userPlusIcon from "/user-plus.svg";
import usersIcon from "/users.svg";
import HamburgerButton from "./HamburgerButton";

export type NavigationElement = { title: string; to: string; icon: string };

const navigationListSets: Record<
  "unauthenticated" | "authenticated",
  NavigationElement[]
> = {
  unauthenticated: [
    { title: "Home", to: "/", icon: homeIcon },
    { title: "Login", to: "/login", icon: loginIcon },
    { title: "Sign Up", to: "/signUp", icon: userPlusIcon },
  ],
  authenticated: [
    { title: "Home", to: "/", icon: homeIcon },
    { title: "Post", to: "/post/create", icon: postIcon },
    { title: "Users", to: "/profile/search", icon: usersIcon },
    { title: "Logout", to: "/logout", icon: logoutIcon },
  ],
};

export default function NavBar() {
  const title = "ODIN BOOK";
  const { isOpen, ref, setIsOpen, exceptionRef } = useClickOutside();
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
    <nav className="relative flex h-10 w-full justify-between bg-linear-to-l from-sky-50 to-amber-50 px-2 text-nowrap break-keep md:h-dvh md:w-fit md:flex-col md:items-center md:justify-start md:bg-linear-to-b md:px-4 md:pt-5 dark:from-sky-950 dark:to-amber-950">
      <HamburgerButton
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        hamburgerRef={exceptionRef}
      />
      <div className="flex items-center justify-center" id="web-navbar-tittle">
        <NavLink
          to={"/"}
          className={
            "text-center text-2xl text-nowrap text-amber-300 transition-colors text-shadow-md hover:text-amber-400"
          }
        >
          {title}
        </NavLink>
      </div>

      <menu
        className={`${isOpen ? "absolute inset-y-10 left-0 flex h-fit flex-col items-start bg-linear-to-t p-5 dark:from-red-950 dark:to-blue-950" : "hidden"} w-fit gap-5 overflow-visible md:flex md:w-fit md:flex-col md:items-start md:justify-start md:py-5`}
        ref={ref}
      >
        {navigationList.map((navigationElement) => (
          <li key={navigationElement.title} onClick={() => setIsOpen(false)}>
            <NavigationLink
              title={navigationElement.title}
              to={navigationElement.to}
              icon={navigationElement.icon}
            />
          </li>
        ))}
      </menu>

      {fetcher.data && fetcher.data.user && (
        <div className="flex items-center justify-center gap-2 md:max-h-[calc(var(--text-xl--line-height)*var(--text-xl))] md:max-w-min md:items-stretch md:px-5">
          <NavLink
            className="text-shadow hidden max-w-min text-orange-300 hover:cursor-pointer hover:text-orange-400 active:text-amber-600 md:flex md:flex-1 md:text-xl"
            to={`/profile/${fetcher.data.user.id}`}
          >
            {fetcher.data.user.firstName.length +
              fetcher.data.user.lastName.length >
            title.length
              ? fetcher.data.user.firstName > fetcher.data.user.lastName
                ? fetcher.data.user.lastName
                : fetcher.data.user.firstName
              : fetcher.data.user.firstName + " " + fetcher.data.user.lastName}
          </NavLink>
          <img
            src={`/profile/${fetcher.data.user.id}/avatar`}
            alt=""
            className={`inline aspect-square rounded-full border border-amber-300 object-cover hover:cursor-pointer hover:border-amber-500 max-md:size-[calc(var(--text-2xl--line-height)*var(--text-2xl))]`}
            onClick={() => {
              if (fetcher.data && fetcher.data.user) {
                navigate(`/profile/${fetcher.data.user.id}`);
              }
            }}
          />
        </div>
      )}
    </nav>
  );
}
