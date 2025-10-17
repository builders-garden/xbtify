import type { MiniAppNotificationDetails } from "@farcaster/miniapp-core";
import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { ulid } from "ulid";
import type { Address } from "viem";

/**
 * Farcaster User table
 */
export const userTable = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => ulid()),
  avatarUrl: text("avatar_url"),
  username: text("username"),
  // Farcaster
  farcasterFid: integer("farcaster_fid").unique(),
  farcasterUsername: text("farcaster_username"),
  farcasterDisplayName: text("farcaster_display_name"),
  farcasterAvatarUrl: text("farcaster_avatar_url"),
  farcasterNotificationDetails: jsonb(
    "farcaster_notification_details"
  ).$type<MiniAppNotificationDetails | null>(),
  farcasterWallets: jsonb("farcaster_wallets").$type<Address[]>(),
  farcasterReferrerFid: integer("farcaster_referrer_fid"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type User = typeof userTable.$inferSelect;
export type CreateUser = typeof userTable.$inferInsert;
export type UpdateUser = Partial<CreateUser>;

export const walletTable = pgTable(
  "wallet",
  {
    address: text("address").$type<Address>().primaryKey(),
    ensName: text("ens_name"),
    baseName: text("base_name"),
    ensAvatarUrl: text("ens_avatar_url"),
    baseAvatarUrl: text("base_avatar_url"),
    userId: text("user_id")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    isPrimary: boolean("is_primary").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index("idx_wallet_user_id").on(t.userId)]
);

export type Wallet = typeof walletTable.$inferSelect;
export type CreateWallet = typeof walletTable.$inferInsert;
export type UpdateWallet = Partial<CreateWallet>;

// Relations
export const userRelations = relations(userTable, ({ many }) => ({
  wallets: many(walletTable),
}));

export const walletRelations = relations(walletTable, ({ one }) => ({
  user: one(userTable, {
    fields: [walletTable.userId],
    references: [userTable.id],
  }),
}));

/**
 * Cast table
 */
export const castTable = pgTable(
  "cast",
  {
    hash: text("hash").primaryKey(),
    fid: integer("fid").notNull(),
    text: text("text").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => [index("idx_cast_fid").on(t.fid)]
);

export type Cast = typeof castTable.$inferSelect;
export type CreateCast = typeof castTable.$inferInsert;
export type UpdateCast = Partial<CreateCast>;

/**
 * Agent table
 */
export const agentTable = pgTable(
  "agent",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => ulid()),
    fid: integer("fid").notNull().unique(),
    creatorFid: integer("creator_fid")
      .notNull()
      .references(() => userTable.farcasterFid, { onDelete: "cascade" }),
    basePrompt: text("base_prompt"),
    customPrompt: text("custom_prompt"),
    finalPrompt: text("final_prompt"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [index("idx_agent_creator_fid").on(t.creatorFid)]
);

export type Agent = typeof agentTable.$inferSelect;
export type CreateAgent = typeof agentTable.$inferInsert;
export type UpdateAgent = Partial<CreateAgent>;

// Relations for Cast
export const castRelations = relations(castTable, ({ one }) => ({
  user: one(userTable, {
    fields: [castTable.fid],
    references: [userTable.farcasterFid],
  }),
}));

// Relations for Agent
export const agentRelations = relations(agentTable, ({ one }) => ({
  creator: one(userTable, {
    fields: [agentTable.creatorFid],
    references: [userTable.farcasterFid],
  }),
}));
