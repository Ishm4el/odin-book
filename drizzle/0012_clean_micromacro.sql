ALTER TABLE "comment" RENAME TO "comments";--> statement-breakpoint
ALTER TABLE "post" RENAME TO "posts";--> statement-breakpoint
ALTER TABLE "user" RENAME TO "users";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "user_email_unique";--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comment_author_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comment_post_id_post_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" DROP CONSTRAINT "comment_liked_by_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "follows" DROP CONSTRAINT "follows_follower_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "follows" DROP CONSTRAINT "follows_followee_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "post_author_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "usersLikedComments" DROP CONSTRAINT "usersLikedComments_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "usersLikedComments" DROP CONSTRAINT "usersLikedComments_comment_id_comment_id_fk";
--> statement-breakpoint
ALTER TABLE "usersLikedPosts" DROP CONSTRAINT "usersLikedPosts_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "usersLikedPosts" DROP CONSTRAINT "usersLikedPosts_post_id_post_id_fk";
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_liked_by_users_users_id_fk" FOREIGN KEY ("liked_by_users") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_users_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_followee_id_users_id_fk" FOREIGN KEY ("followee_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usersLikedComments" ADD CONSTRAINT "usersLikedComments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usersLikedComments" ADD CONSTRAINT "usersLikedComments_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usersLikedPosts" ADD CONSTRAINT "usersLikedPosts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usersLikedPosts" ADD CONSTRAINT "usersLikedPosts_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE("email");