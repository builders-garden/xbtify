import { z } from "zod";

/**
 * Schema for creating a new agent
 */
export const createAgentSchema = z.object({
  fname: z
    .string()
    .min(1)
    .max(16)
    .regex(/^[a-z0-9-]+$/, {
      message:
        "Username must contain only lowercase letters, numbers, and hyphens",
    }),
  displayName: z.string().min(1).max(100).optional(),
  personality: z.string().optional(),
  bio: z.string().max(256).optional(),
  pfpUrl: z.string().url().optional(),
  url: z.string().url().optional(),
});

/**
 * Schema for updating an agent
 */
export const updateAgentSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  personality: z.string().max(500).optional(),
  chaosLevel: z.number().min(0).max(100).optional(),
  autoRespond: z.boolean().optional(),
  dmEnabled: z.boolean().optional(),
});

/**
 * Schema for agent response
 */
export const agentResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  bio: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  personality: z.string(),
  chaosLevel: z.number(),
  autoRespond: z.boolean(),
  dmEnabled: z.boolean(),
  totalInteractions: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Schema for activity response
 */
export const activityResponseSchema = z.object({
  id: z.string(),
  type: z.enum(["answer", "review"]),
  agentReply: z.string(),
  originalMessage: z.string(),
  originalUser: z.object({
    username: z.string(),
    fid: z.number(),
  }),
  timestamp: z.date(),
  status: z.enum(["pending", "approved", "rejected"]),
});

/**
 * Schema for approving/rejecting activities
 */
export const activityActionSchema = z.object({
  agentId: z.string(),
});

/**
 * Schema for marketplace agent response
 */
export const marketplaceAgentResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  bio: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  personality: z.string(),
  totalInteractions: z.number(),
  rating: z.number().min(0).max(5),
  externalUrl: z.string().url(),
});

/**
 * Type exports
 */
export type CreateAgentInput = z.infer<typeof createAgentSchema>;
export type UpdateAgentInput = z.infer<typeof updateAgentSchema>;
export type AgentResponse = z.infer<typeof agentResponseSchema>;
export type ActivityResponse = z.infer<typeof activityResponseSchema>;
export type ActivityActionInput = z.infer<typeof activityActionSchema>;
export type MarketplaceAgentResponse = z.infer<
  typeof marketplaceAgentResponseSchema
>;
