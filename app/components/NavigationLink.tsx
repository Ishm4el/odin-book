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
      className={"font-medium text-blue-600 dark:text-blue-500 hover:text-blue-700 transition-colors hover:underline text-lg"}
    >
      {title}
    </NavLink>
  );
}
