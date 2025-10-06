import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./layouts/Navbar.tsx", [
    index("routes/home.tsx"),
    route("/login", "routes/login.tsx"),
    route("/sign_up", "routes/sign_up.tsx"),
  ]),
] satisfies RouteConfig;
