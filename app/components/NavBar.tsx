import { NavLink, useFetcher, useNavigate } from "react-router";
import NavigationLink from "./NavigationLink";
import type { loader } from "app/api/isAuthenticated";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

// icons
import homeIcon from "/home.svg";
import loginIcon from "/log-in.svg";
import logoutIcon from "/log-out.svg";
import postIcon from "/message-square.svg";
import userPlusIcon from "/user-plus.svg";
import usersIcon from "/users.svg";

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

const useClickOutsite = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const ref = useRef<HTMLElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutsite = (event: MouseEvent | TouchEvent) => {
      if (
        ref.current &&
        event.target &&
        !ref.current.contains(event.target as Node) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsite);
    document.addEventListener("touchstart", handleClickOutsite);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsite);
      document.removeEventListener("touchstart", handleClickOutsite);
    };
  }, [isOpen]);

  return { ref, isOpen, setIsOpen, hamburgerRef };
};

function HamburgerButton({
  isOpen,
  setIsOpen,
  hamburgerRef,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  hamburgerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <button
      className="text-white hover:cursor-pointer focus:outline-none md:hidden"
      onClick={(event) => setIsOpen(!isOpen)}
      aria-label="Toggle menu"
      ref={hamburgerRef}
    >
      <svg
        className="h-6 w-6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        {isOpen ? (
          <path d="M6 18L18 6M6 6l12 12" />
        ) : (
          <path d="M4 6h16M4 12h16M4 18h16" />
        )}
      </svg>
    </button>
  );
}

export default function NavBar() {
  const { isOpen, ref, setIsOpen, hamburgerRef } = useClickOutsite();
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
    <nav className="relative flex h-10 w-full justify-between bg-linear-to-l from-sky-50 to-amber-50 px-2 md:h-dvh md:w-fit md:flex-col md:justify-start md:bg-linear-to-b md:px-2 md:pt-5 dark:from-sky-950 dark:to-amber-950">
      <HamburgerButton
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        hamburgerRef={hamburgerRef}
      />
      <div
        className="flex items-center justify-center py-2 md:w-full"
        id="web-navbar-tittle"
      >
        <NavLink
          to={"/"}
          className={
            "text-center text-nowrap text-amber-300 transition-colors text-shadow-md hover:text-amber-400"
          }
        >
          ODIN BOOK
        </NavLink>
      </div>
      <menu
        className={`${isOpen ? "absolute inset-y-10 left-0 flex h-fit w-fit flex-col items-start bg-linear-to-t p-5 dark:from-red-950 dark:to-blue-950" : "hidden"} w-2/3 gap-3 md:flex md:w-full md:flex-col md:items-start md:justify-start`}
        ref={ref}
      >
        {navigationList.map((navigationElement) => (
          <li key={navigationElement.title}>
            <NavigationLink
              title={navigationElement.title}
              to={navigationElement.to}
              icon={navigationElement.icon}
            />
          </li>
        ))}
        {fetcher.data && fetcher.data.user && (
          <li
            className="flex items-center gap-2 self-center justify-self-center text-lg font-medium md:gap-1"
            onClick={() => {
              if (fetcher.data && fetcher.data.user) {
                navigate(`/profile/${fetcher.data.user.id}`);
              }
            }}
          >
            <span className="text-shadow text-3xl text-orange-300 hover:cursor-pointer hover:text-orange-400 active:text-amber-600 md:text-xl">
              {fetcher.data.user.firstName + " " + fetcher.data.user.lastName}
            </span>
            <img
              src={`/profile/${fetcher.data.user.id}/avatar`}
              alt="User Avatar"
              className="inline size-[calc(var(--text-3xl--line-height)*var(--text-3xl))] rounded-full border border-amber-300 object-cover hover:cursor-pointer hover:border-amber-500 active:border-amber-600 md:size-[calc(var(--text-xl--line-height)*var(--text-xl))]"
            />
          </li>
        )}
      </menu>
    </nav>
  );
}
