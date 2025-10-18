import {
  boolean,
  foreignKey,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const cast = pgTable(
  "cast",
  {
    hash: text().primaryKey().notNull(),
    fid: integer().notNull(),
    text: text().notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    index("idx_cast_fid").using(
      "btree",
      table.fid.asc().nullsLast().op("int4_ops")
    ),
  ]
);

export const user = pgTable(
  "user",
  {
    id: text().primaryKey().notNull(),
    avatarUrl: text("avatar_url"),
    username: text(),
    inboxId: text("inbox_id"),
    farcasterFid: integer("farcaster_fid"),
    farcasterUsername: text("farcaster_username"),
    farcasterDisplayName: text("farcaster_display_name"),
    farcasterAvatarUrl: text("farcaster_avatar_url"),
    farcasterNotificationDetails: jsonb("farcaster_notification_details"),
    farcasterWallets: jsonb("farcaster_wallets"),
    farcasterReferrerFid: integer("farcaster_referrer_fid"),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    unique("user_inbox_id_unique").on(table.inboxId),
    unique("user_farcaster_fid_unique").on(table.farcasterFid),
  ]
);

export const group = pgTable(
  "group",
  {
    id: text().primaryKey().notNull(),
    conversationId: text("conversation_id").notNull(),
    name: text(),
    description: text(),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    uniqueIndex("group_conversation_id_unique_idx").using(
      "btree",
      table.conversationId.asc().nullsLast().op("text_ops")
    ),
  ]
);

export const groupMember = pgTable(
  "group_member",
  {
    id: text().primaryKey().notNull(),
    groupId: text("group_id").notNull(),
    userId: text("user_id").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    uniqueIndex("group_member_group_user_unique_idx").using(
      "btree",
      table.groupId.asc().nullsLast().op("text_ops"),
      table.userId.asc().nullsLast().op("text_ops")
    ),
    foreignKey({
      columns: [table.groupId],
      foreignColumns: [group.id],
      name: "group_member_group_id_group_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "group_member_user_id_user_id_fk",
    }).onDelete("cascade"),
  ]
);

export const wallet = pgTable(
  "wallet",
  {
    address: text().primaryKey().notNull(),
    ensName: text("ens_name"),
    baseName: text("base_name"),
    ensAvatarUrl: text("ens_avatar_url"),
    baseAvatarUrl: text("base_avatar_url"),
    userId: text("user_id").notNull(),
    isPrimary: boolean("is_primary").default(false),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    index("idx_wallet_user_id").using(
      "btree",
      table.userId.asc().nullsLast().op("text_ops")
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "wallet_user_id_user_id_fk",
    }).onDelete("cascade"),
  ]
);

export const agent = pgTable(
  "agent",
  {
    id: text().primaryKey().notNull(),
    fid: integer().notNull(),
    creatorFid: integer("creator_fid").notNull(),
    styleProfilePrompt: text("style_profile_prompt"),
    topicPatternsPrompt: text("topic_patterns_prompt"),
    keywords: text(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
    status: text().notNull(),
    personality: text(),
    tone: text(),
    movieCharacter: text("movie_character"),
    username: text(),
    displayName: text("display_name"),
    avatarUrl: text("avatar_url"),
    address: text(),
    privateKey: text("private_key"),
    mnemonic: text(),
    signerUuid: text("signer_uuid"),
  },
  (table) => [
    index("idx_agent_creator_fid").using(
      "btree",
      table.creatorFid.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.creatorFid],
      foreignColumns: [user.farcasterFid],
      name: "agent_creator_fid_user_farcaster_fid_fk",
    }).onDelete("cascade"),
    unique("agent_fid_unique").on(table.fid),
  ]
);

export const reply = pgTable(
  "reply",
  {
    hash: text().primaryKey().notNull(),
    fid: integer().notNull(),
    text: text().notNull(),
    parentText: text("parent_text").notNull(),
    parentAuthorFid: text("parent_author_fid").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    index("idx_reply_fid").using(
      "btree",
      table.fid.asc().nullsLast().op("int4_ops")
    ),
  ]
);
