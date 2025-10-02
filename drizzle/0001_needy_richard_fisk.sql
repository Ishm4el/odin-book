CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"birthdate" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "guestBook" CASCADE;