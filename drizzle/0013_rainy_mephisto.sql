ALTER TABLE "comments" RENAME COLUMN "date_published" TO "datePublished";--> statement-breakpoint
ALTER TABLE "comments" RENAME COLUMN "date_updated" TO "dateUpdated";--> statement-breakpoint
ALTER TABLE "comments" RENAME COLUMN "author_id" TO "authorId";--> statement-breakpoint
ALTER TABLE "comments" RENAME COLUMN "post_id" TO "postId";--> statement-breakpoint
ALTER TABLE "comments" RENAME COLUMN "liked_by_users" TO "likedByUsers";--> statement-breakpoint
ALTER TABLE "follows" RENAME COLUMN "follower_id" TO "followerId";--> statement-breakpoint
ALTER TABLE "follows" RENAME COLUMN "followee_id" TO "followeeId";--> statement-breakpoint
ALTER TABLE "posts" RENAME COLUMN "date_published" TO "datePublished";--> statement-breakpoint
ALTER TABLE "posts" RENAME COLUMN "date_updated" TO "dateUpdated";--> statement-breakpoint
ALTER TABLE "posts" RENAME COLUMN "author_id" TO "authorId";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "first_name" TO "firstName";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "last_name" TO "lastName";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "profile_picture_address" TO "profilePictureAddress";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "birth_date" TO "birthDate";--> statement-breakpoint
ALTER TABLE "usersLikedComments" RENAME COLUMN "user_id" TO "userId";--> statement-breakpoint
ALTER TABLE "usersLikedComments" RENAME COLUMN "comment_id" TO "commentId";--> statement-breakpoint
ALTER TABLE "usersLikedPosts" RENAME COLUMN "user_id" TO "userId";--> statement-breakpoint
ALTER TABLE "usersLikedPosts" RENAME COLUMN "post_id" TO "postId";--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_author_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comments_liked_by_users_users_id_fk";
--> statement-breakpoint
ALTER TABLE "follows" DROP CONSTRAINT "follows_follower_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "follows" DROP CONSTRAINT "follows_followee_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "posts_author_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "usersLikedComments" DROP CONSTRAINT "usersLikedComments_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "usersLikedComments" DROP CONSTRAINT "usersLikedComments_comment_id_comments_id_fk";
--> statement-breakpoint
ALTER TABLE "usersLikedPosts" DROP CONSTRAINT "usersLikedPosts_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "usersLikedPosts" DROP CONSTRAINT "usersLikedPosts_post_id_posts_id_fk";
--> statement-breakpoint
ALTER TABLE "follows" DROP CONSTRAINT "follows_followee_id_follower_id_pk";--> statement-breakpoint
ALTER TABLE "usersLikedComments" DROP CONSTRAINT "usersLikedComments_user_id_comment_id_pk";--> statement-breakpoint
ALTER TABLE "usersLikedPosts" DROP CONSTRAINT "usersLikedPosts_user_id_post_id_pk";--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_followeeId_followerId_pk" PRIMARY KEY("followeeId","followerId");--> statement-breakpoint
ALTER TABLE "usersLikedComments" ADD CONSTRAINT "usersLikedComments_userId_commentId_pk" PRIMARY KEY("userId","commentId");--> statement-breakpoint
ALTER TABLE "usersLikedPosts" ADD CONSTRAINT "usersLikedPosts_userId_postId_pk" PRIMARY KEY("userId","postId");--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_authorId_users_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_postId_posts_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_likedByUsers_users_id_fk" FOREIGN KEY ("likedByUsers") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_followerId_users_id_fk" FOREIGN KEY ("followerId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_followeeId_users_id_fk" FOREIGN KEY ("followeeId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_authorId_users_id_fk" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usersLikedComments" ADD CONSTRAINT "usersLikedComments_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usersLikedComments" ADD CONSTRAINT "usersLikedComments_commentId_comments_id_fk" FOREIGN KEY ("commentId") REFERENCES "public"."comments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usersLikedPosts" ADD CONSTRAINT "usersLikedPosts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usersLikedPosts" ADD CONSTRAINT "usersLikedPosts_postId_posts_id_fk" FOREIGN KEY ("postId") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;