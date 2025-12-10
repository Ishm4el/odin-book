import { NavLink } from "react-router";
import { type NavigationElement } from "./NavBar";

export default function NavigationLink({ title, to, Icon }: NavigationElement) {
  return (
    <NavLink
      to={to}
      className={
        "group flex items-center justify-center gap-1 text-3xl font-medium text-orange-600 transition-colors hover:text-orange-700 hover:underline active:text-red-500 md:justify-start md:text-lg dark:text-orange-500 dark:text-shadow-2xs dark:text-shadow-sky-50 dark:hover:text-orange-400 dark:active:text-orange-600"
      }
    >
      <Icon className="transition-colors group-hover:stroke-sky-500 dark:stroke-white" />
      <span className="">{title}</span>
    </NavLink>
  );
}
