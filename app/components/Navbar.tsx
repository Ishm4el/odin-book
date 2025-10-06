import { Outlet } from "react-router";
import NavigationLink from "./NavigationLink";

export default function NavBar({
  navigationList = [
    { title: "Home", to: "/" },
    { title: "Login", to: "/login" },
    { title: "Sign Up", to: "/sign_up" },
  ],
}: {
  navigationList: { title: string; to: string }[];
}) {
  return (
    <>
      <nav>
        {navigationList.map((navigationElement) => (
          <NavigationLink
            key={navigationElement.title}
            title={navigationElement.title}
            to={navigationElement.to}
          />
        ))}
      </nav>
      <Outlet />
    </>
  );
}
