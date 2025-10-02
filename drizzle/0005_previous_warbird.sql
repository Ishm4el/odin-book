ALTER TABLE "user" ADD COLUMN "follows_parent_id" uuid;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "followed_parent_id" uuid;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "requested_parent_id" uuid;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "requestee_parent_id" uuid;