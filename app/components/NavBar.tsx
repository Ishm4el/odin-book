import { NavLink } from "react-router";
import NavigationLink from "./NavigationLink";
import { useEffect, useState } from "react";

export default async function NavBar({
  navigationList = [
    { title: "Home", to: "/" },
    { title: "Login", to: "/login" },
    { title: "Sign Up", to: "/sign_up" },
  ],
  user,
}: {
  navigationList?: { title: string; to: string }[];
  user?: { name: string; profilePictureURL: string };
}) {
  console.log(user?.profilePictureURL);

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
      <menu className="w-1/2 flex justify-around items-center">
        {navigationList.map((navigationElement) => (
          <li key={navigationElement.title}>
            <NavigationLink
              title={navigationElement.title}
              to={navigationElement.to}
            />
          </li>
        ))}
        {user ? (
          <li className="font-medium text-lg flex gap-3 h-full items-center">
            <span className="hover:cursor-pointer text-orange-300 text-shadow hover:text-orange-400">
              {user.name}
            </span>
            <img
              src={`http://localhost:3000${user.profilePictureURL}`}
              alt="User Avatar"
              className="object-contain h-8 rounded-2xl w-8 border border-amber-300 hover:cursor-pointer hover:border-amber-500"
            />
          </li>
        ) : null}
      </menu>
    </nav>
  );
}
