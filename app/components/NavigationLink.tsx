import { NavLink } from "react-router";

export default function NavigationLink({
  title,
  to,
}: {
  title: string;
  to: string;
}) {
  return (
    <NavLink
      to={to}
      className={
        "text-lg font-medium text-orange-600 transition-colors hover:text-orange-700 hover:underline active:text-red-500 dark:text-orange-500 dark:hover:text-orange-400 dark:active:text-orange-600"
      }
    >
      {title}
    </NavLink>
  );
}
