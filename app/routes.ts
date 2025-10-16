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
      route("/post", "routes/post.tsx"),
      route("/post/like/:postId", "routes/likePost.tsx"),
      route("/post/isLiked/:postId", "routes/isPostLiked.tsx"),
      route("/comment/like/:commentId", "routes/likeComment.tsx"),
      route("/comment/isLiked/:commentId", "routes/isCommentLiked.tsx"),
      route("/comments/:postId", "routes/comments.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
