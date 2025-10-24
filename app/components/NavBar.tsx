import { NavLink, useNavigate } from "react-router";
import NavigationLink from "./NavigationLink";

export default function NavBar({
  navigationList = [
    { title: "Home", to: "/" },
    { title: "Login", to: "/login" },
    { title: "Sign Up", to: "/sign_up" },
  ],
  user,
  className,
}: {
  navigationList?: { title: string; to: string }[];
  user?: { name: string; profilePictureURL: string; userId: string };
  className?: string;
}) {
  const navigate = useNavigate();
  return (
    <nav
      className={
        "w-full flex h-10 bg-sky-50 md:flex-col md:w-[8dvw] md:h-dvh bg-linear-to-b from-sky-50 to-amber-50 " +
        className
      }
    >
      <div className="w-1/3 flex justify-center items-center md:w-full ">
        <NavLink
          to={"/"}
          className={
            "text-amber-300 text-shadow-md hover:text-amber-400 transition-colors text-center text-nowrap"
          }
        >
          ODIN BOOK
        </NavLink>
      </div>
      <menu className="w-2/3 flex justify-around items-center md:flex-col md:w-full">
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
            className="font-medium text-lg flex gap-1 items-center self-center justify-self-center"
            onClick={() => {
              navigate(`/profile/${user.userId}`);
            }}
          >
            <span className="hover:cursor-pointer text-orange-300 text-shadow hover:text-orange-400 active:text-amber-600">
              {user.name}
            </span>
            <img
              src={`http://localhost:3000${user.profilePictureURL}`}
              alt="User Avatar"
              className="inline object-cover rounded-full border border-amber-300 hover:cursor-pointer hover:border-amber-500 active:border-amber-600 size-[calc(var(--text-xl--line-height)*var(--text-xl))]"
              />
          </li>
        ) : null}
      </menu>
    </nav>
  );
}
