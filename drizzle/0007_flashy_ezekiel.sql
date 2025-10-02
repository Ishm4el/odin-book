CREATE TABLE IF NOT EXISTS "follows" (
	"follower_id" uuid NOT NULL,
	"followee_id" uuid NOT NULL,
	CONSTRAINT "follows_follower_id_followee_id_pk" PRIMARY KEY("follower_id","followee_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_id_user_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "follows" ADD CONSTRAINT "follows_followee_id_user_id_fk" FOREIGN KEY ("followee_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "follows_parent_id";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "followed_parent_id";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "requested_parent_id";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "requestee_parent_id";