import { NavLink } from "react-router";
import { type NavigationElement } from "./NavBar";

export default function NavigationLink({ title, to, icon }: NavigationElement) {
  return (
    <NavLink
      to={to}
      className={
        "flex items-center justify-center gap-1 text-3xl font-medium text-orange-600 transition-colors hover:text-orange-700 hover:underline active:text-red-500 md:justify-start md:text-lg dark:text-orange-500 dark:text-shadow-2xs dark:text-shadow-sky-50 dark:hover:text-orange-400 dark:active:text-orange-600"
      }
    >
      <img src={icon} alt="" className="invert sepia filter md:visible" />
      <span>{title}</span>
    </NavLink>
  );
}
