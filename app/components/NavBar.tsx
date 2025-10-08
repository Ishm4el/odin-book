import { NavLink } from "react-router";
import NavigationLink from "./NavigationLink";

export default function NavBar({
  navigationList = [
    { title: "Home", to: "/" },
    { title: "Login", to: "/login" },
    { title: "Sign Up", to: "/sign_up" },
  ],
}: {
  navigationList?: { title: string; to: string }[];
}) {
  return (
    <nav className="w-full flex h-10 bg-sky-50">
      <div className="w-1/2 flex justify-center items-center">
        <NavLink
          to={"/"}
          className={
            " text-amber-300 text-shadow-md hover:text-amber-400 transition-colors"
          }
        >
          ODIN BOOK
        </NavLink>
      </div>
      <div className="w-1/2 flex justify-around items-center">
        {navigationList.map((navigationElement) => (
          <NavigationLink
            key={navigationElement.title}
            title={navigationElement.title}
            to={navigationElement.to}
          />
        ))}
      </div>
    </nav>
  );
}
