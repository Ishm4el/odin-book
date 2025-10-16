// import { Form } from "react-router";
// import type { loader } from "./home";


// function PostCommentForm({ post }: { post: { id: string } }) {
//   return (
//     <Form
//       method="post"
//       className="w-full flex p-2"
//       onSubmit={(e) => {
//         e.currentTarget.reset();
//       }}
//     >
//       <input
//         type="text"
//         hidden
//         value={post.id}
//         name="postId"
//         id="postId"
//         readOnly
//       />
//       <input
//         type="text"
//         className="flex-1 ring p-1"
//         name="comment"
//         id="comment"
//       />
//       <button
//         className="bg-blue-500 focus:bg-blue-700 transition-colors hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:cursor-pointer"
//         type="submit"
//       >
//         Post Comment
//       </button>
//     </Form>
//   );
// }

// function Comment({ comment }: comment) {
//   return (
//     <li className="p-3 inset-shadow-sm inset-shadow-indigo-200">
//       <h4 className="inline">
//         {comment.authorId.firstName} {comment.authorId.lastName}{" "}
//       </h4>
//       <img
//         src={`http://localhost:3000${comment.authorId.profilePictureAddress}`}
//         alt="commentor profile picture"
//         className="size-5 inline object-contain rounded-2xl border border-amber-300 hover:cursor-pointer hover:border-amber-500"
//       />
//       <h4 className="inline">
//         {" - "}
//         {comment.datePublished.toString()}
//       </h4>
//       <br />
//       <span>{comment.text}</span>
//       <div id="like-comment">{comment.likedByUsers}</div>
//     </li>
//   );
// }

// type post = Pick<Awaited<ReturnType<typeof loader>>, "postsToDisplay">

// function CommentList({ post }: ) {
//   return (
//     <ul id="comments">
//       {post.comments &&
//         post.comments.map((comment) => (
//           <Comment comment={comment} key={comment.id} />
//         ))}
//     </ul>
//   );
// }
