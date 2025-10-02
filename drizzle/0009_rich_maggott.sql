ALTER TABLE "comment" ADD COLUMN "date_published" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "comment" ADD COLUMN "date_updated" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "comment" DROP COLUMN IF EXISTS "date";