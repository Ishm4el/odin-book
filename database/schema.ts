import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    firstName: varchar("firstName", { length: 50 }).notNull(),
    lastName: varchar("lastName", { length: 50 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    created: timestamp("created").defaultNow().notNull(),
    profilePictureAddress: text("profilePictureAddress")
      .notNull()
      .default("/profileImages/theDefault.jpg"),
    birthdate: date("birthdate").notNull(),

    // friends - many users   X
    // posts - many posts
    // likeedPosts - many posts
    // likedComments - many comments
    // comments - many comments
  },
  (table) => [uniqueIndex("email_idx").on(table.email)]
);
export const usersRelations = relations(users, ({ many }) => ({
  // follows
  follows: many(follows, { relationName: "follows" }),
  followers: many(follows, { relationName: "followers" }),

  // posts
  posts: many(posts, { relationName: "postAuthor" }),
  // userLikedPosts
  usersToLikedPosts: many(usersLikedPosts),

  // comments
  comments: many(comments, { relationName: "commentAuthor" }),
  // userLikedComments
  usersLikedComments: many(usersLikedComments),
}));

export const posts = pgTable("posts", {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar({ length: 100 }).notNull(),
  text: varchar({ length: 255 }).notNull(),
  datePublished: timestamp().defaultNow().notNull(),
  dateUpdated: timestamp().defaultNow().notNull(),

  // author - 1 user
  authorId: uuid()
    .references(() => users.id)
    .notNull(),

  // comments - many comment
});
export const postsRelations = relations(posts, ({ one, many }) => ({
  // the author
  authorId: one(users, {
    fields: [posts.authorId],
    references: [users.id],
    relationName: "postAuthor",
  }),

  // comments
  comments: many(comments, { relationName: "commentPost" }),

  // users that have liked this post table
  usersToLikedPosts: many(usersLikedPosts, { relationName: "usersLikedPosts" }),
}));

export const comments = pgTable("comments", {
  id: uuid().defaultRandom().notNull(),
  text: varchar({ length: 255 }).notNull(),
  datePublished: timestamp().defaultNow().notNull(),
  dateUpdated: timestamp().defaultNow().notNull(),

  // author - 1 user
  authorId: uuid()
    .references(() => users.id)
    .notNull(),

  // post - 1 post
  postId: uuid()
    .references(() => posts.id)
    .notNull(),

  likedByUsers: uuid().references(() => users.id),
});
export const commentsRelations = relations(comments, ({ one, many }) => ({
  postId: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
    relationName: "commentPost",
  }),
  authorId: one(users, {
    fields: [comments.authorId],
    references: [users.id],
    relationName: "commentAuthor",
  }),

  // usersLikedComments
  usersLikedComments: many(usersLikedComments),
}));

export const follows = pgTable(
  "follows",
  {
    followerId: uuid()
      .notNull()
      .references(() => users.id),
    followeeId: uuid()
      .notNull()
      .references(() => users.id),
  },
  (table) => [primaryKey({ columns: [table.followeeId, table.followerId] })]
);
export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.followerId],
    references: [users.id],
    relationName: "follows",
  }),
  followee: one(users, {
    fields: [follows.followeeId],
    references: [users.id],
    relationName: "followers",
  }),
}));

export const usersLikedPosts = pgTable(
  "usersLikedPosts",
  {
    like: boolean().default(false).notNull(),

    userId: uuid()
      .notNull()
      .references(() => users.id),

    postId: uuid()
      .notNull()
      .references(() => posts.id),
  },
  (table) => [primaryKey({ columns: [table.userId, table.postId], name: "id" })]
);
export const usersLikedPostsRelations = relations(
  usersLikedPosts,
  ({ one }) => ({
    user: one(users, {
      fields: [usersLikedPosts.userId],
      references: [users.id],
    }),
    post: one(posts, {
      fields: [usersLikedPosts.postId],
      references: [posts.id],
    }),
  })
);

export const usersLikedComments = pgTable(
  "usersLikedComments",
  {
    like: boolean().default(false).notNull(),

    userId: uuid()
      .notNull()
      .references(() => users.id),

    commentId: uuid()
      .notNull()
      .references(() => comments.id),
  },
  (table) => [primaryKey({ columns: [table.userId, table.commentId] })]
);
export const usersLikedCommentsRelations = relations(
  usersLikedComments,
  ({ one }) => ({
    user: one(users, {
      fields: [usersLikedComments.userId],
      references: [users.id],
    }),
    comment: one(comments, {
      fields: [usersLikedComments.commentId],
      references: [comments.id],
    }),
  })
);
