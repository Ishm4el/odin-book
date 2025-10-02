ALTER TABLE "user" ADD COLUMN "created" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "profile_picture_address" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "birth_date" date NOT NULL;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "birthdate";