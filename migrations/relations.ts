import { relations } from "drizzle-orm/relations";
import { agent, group, groupMember, user, wallet } from "./schema";

export const groupMemberRelations = relations(groupMember, ({ one }) => ({
  group: one(group, {
    fields: [groupMember.groupId],
    references: [group.id],
  }),
  user: one(user, {
    fields: [groupMember.userId],
    references: [user.id],
  }),
}));

export const groupRelations = relations(group, ({ many }) => ({
  groupMembers: many(groupMember),
}));

export const userRelations = relations(user, ({ many }) => ({
  groupMembers: many(groupMember),
  wallets: many(wallet),
  agents: many(agent),
}));

export const walletRelations = relations(wallet, ({ one }) => ({
  user: one(user, {
    fields: [wallet.userId],
    references: [user.id],
  }),
}));

export const agentRelations = relations(agent, ({ one }) => ({
  user: one(user, {
    fields: [agent.creatorFid],
    references: [user.farcasterFid],
  }),
}));
