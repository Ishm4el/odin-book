import { NavLink, useNavigate } from "react-router";
import NavigationLink from "./NavigationLink";

export default function NavBar({
  navigationList = [
    { title: "Home", to: "/" },
    { title: "Login", to: "/login" },
    { title: "Sign Up", to: "/signUp" },
  ],
  user,
  className,
}: {
  navigationList?: { title: string; to: string }[];
  user?: { name: string; userId: string };
  className?: string;
}) {
  const navigate = useNavigate();
  return (
    <nav
      className={
        "flex h-10 w-full bg-linear-to-b from-sky-50 to-amber-50 md:h-dvh md:w-fit md:flex-col md:px-2 md:pt-5 dark:from-sky-950 dark:to-amber-950 " +
        className
      }
    >
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
        {user ? (
          <li
            className="flex items-center gap-1 self-center justify-self-center text-lg font-medium"
            onClick={() => {
              navigate(`/profile/${user.userId}`);
            }}
          >
            <span className="text-shadow text-orange-300 hover:cursor-pointer hover:text-orange-400 active:text-amber-600">
              {user.name}
            </span>
            <img
              src={`/profile/${user.userId}/avatar`}
              alt="User Avatar"
              className="inline size-[calc(var(--text-xl--line-height)*var(--text-xl))] rounded-full border border-amber-300 object-cover hover:cursor-pointer hover:border-amber-500 active:border-amber-600"
            />
          </li>
        ) : null}
      </menu>
    </nav>
  );
}
