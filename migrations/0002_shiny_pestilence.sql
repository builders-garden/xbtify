ALTER TABLE "user" ADD COLUMN "inbox_id" text;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_inbox_id_unique" UNIQUE("inbox_id");