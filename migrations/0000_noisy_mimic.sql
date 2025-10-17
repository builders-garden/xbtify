CREATE TABLE "agent" (
	"id" text PRIMARY KEY NOT NULL,
	"fid" integer NOT NULL,
	"creator_fid" integer NOT NULL,
	"base_prompt" text,
	"custom_prompt" text,
	"final_prompt" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "agent_fid_unique" UNIQUE("fid")
);
--> statement-breakpoint
CREATE TABLE "cast" (
	"hash" text PRIMARY KEY NOT NULL,
	"fid" integer NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"avatar_url" text,
	"username" text,
	"farcaster_fid" integer,
	"farcaster_username" text,
	"farcaster_display_name" text,
	"farcaster_avatar_url" text,
	"farcaster_notification_details" jsonb,
	"farcaster_wallets" jsonb,
	"farcaster_referrer_fid" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_farcaster_fid_unique" UNIQUE("farcaster_fid")
);
--> statement-breakpoint
CREATE TABLE "wallet" (
	"address" text PRIMARY KEY NOT NULL,
	"ens_name" text,
	"base_name" text,
	"ens_avatar_url" text,
	"base_avatar_url" text,
	"user_id" text NOT NULL,
	"is_primary" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "agent" ADD CONSTRAINT "agent_creator_fid_user_farcaster_fid_fk" FOREIGN KEY ("creator_fid") REFERENCES "public"."user"("farcaster_fid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet" ADD CONSTRAINT "wallet_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_agent_creator_fid" ON "agent" USING btree ("creator_fid");--> statement-breakpoint
CREATE INDEX "idx_cast_fid" ON "cast" USING btree ("fid");--> statement-breakpoint
CREATE INDEX "idx_wallet_user_id" ON "wallet" USING btree ("user_id");