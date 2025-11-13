import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./layouts/DefaultLayout.tsx", [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),
    route("signUp", "routes/signUp.tsx"),
    route("logout", "routes/logout.tsx"),
    layout("./layouts/ProtectedLayout.tsx", [
      ...prefix("post", [
        route("like/:postId", "api/likePost.tsx"),
        route("isLiked/:postId", "api/isPostLiked.tsx"),
        route("create", "routes/createPost.tsx"),
        route(":postId", "routes/post.tsx", [
          route("image", "api/postImage.tsx"),
        ]),
      ]),

      ...prefix("comment", [
        route("like/:commentId", "api/likeComment.tsx"),
        route("isLiked/:commentId", "api/isCommentLiked.tsx"),
        route(":postId", "routes/comments.tsx"),
      ]),
      route("profile/search", "routes/users/index.tsx"),
      route("profile/:profileId", "routes/profile.tsx", [
        route("avatar", "api/avatar.tsx"),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
