import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./layouts/DefaultLayout.tsx", [
    index("routes/home.tsx"),
    route("/login", "routes/login.tsx"),
    route("/signUp", "routes/signUp.tsx"),
    route("/logout", "routes/logout.tsx"),
    layout("./layouts/ProtectedLayout.tsx", [
      route("/createPost", "routes/createPost.tsx"),
      route("/post/like/:postId", "api/likePost.tsx"),
      route("/post/isLiked/:postId", "api/isPostLiked.tsx"),
      route("/post/:postId", "routes/post.tsx"),
      route("/comment/like/:commentId", "api/likeComment.tsx"),
      route("/comment/isLiked/:commentId", "api/isCommentLiked.tsx"),
      route("/comments/:postId", "routes/comments.tsx"),
      route("/profile/:profileId", "routes/profile.tsx", [
        route("avatar", "api/avatar.tsx"),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
