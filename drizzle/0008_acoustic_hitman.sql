CREATE TABLE IF NOT EXISTS "usersLikedComments" (
	"liked" boolean DEFAULT false NOT NULL,
	"user_id" uuid NOT NULL,
	"comment_id" uuid NOT NULL,
	CONSTRAINT "usersLikedComments_user_id_comment_id_pk" PRIMARY KEY("user_id","comment_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "usersLikedPosts" (
	"like" boolean DEFAULT false NOT NULL,
	"user_id" uuid NOT NULL,
	"post_id" uuid NOT NULL,
	CONSTRAINT "usersLikedPosts_user_id_post_id_pk" PRIMARY KEY("user_id","post_id")
);
--> statement-breakpoint
ALTER TABLE "follows" DROP CONSTRAINT "follows_follower_id_followee_id_pk";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'comment'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "comment" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "follows" ADD CONSTRAINT "follows_followee_id_follower_id_pk" PRIMARY KEY("followee_id","follower_id");--> statement-breakpoint
ALTER TABLE "comment" ADD COLUMN "author_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "comment" ADD COLUMN "post_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "comment" ADD COLUMN "liked_by_users" uuid;--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "date_published" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "date_updated" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usersLikedComments" ADD CONSTRAINT "usersLikedComments_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usersLikedComments" ADD CONSTRAINT "usersLikedComments_comment_id_comment_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comment"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usersLikedPosts" ADD CONSTRAINT "usersLikedPosts_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usersLikedPosts" ADD CONSTRAINT "usersLikedPosts_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comment" ADD CONSTRAINT "comment_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comment" ADD CONSTRAINT "comment_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comment" ADD CONSTRAINT "comment_liked_by_users_user_id_fk" FOREIGN KEY ("liked_by_users") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "post" DROP COLUMN IF EXISTS "date";