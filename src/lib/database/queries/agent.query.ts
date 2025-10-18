import { eq, ne } from "drizzle-orm";
import { db } from "@/lib/database";
import { type Agent, agentTable } from "@/lib/database/db.schema";

/**
 * Get an agent by ID
 * @param agentId - The agent ID
 * @returns The agent or null if not found
 */
export async function getAgentById(agentId: string): Promise<Agent | null> {
  const agent = await db.query.agentTable.findFirst({
    where: eq(agentTable.id, agentId),
  });

  return agent ?? null;
}

/**
 * Get an agent by FID
 * @param fid - The Farcaster FID of the agent
 * @returns The agent or null if not found
 */
export async function getAgentByFid(fid: number): Promise<Agent | null> {
  const agent = await db.query.agentTable.findFirst({
    where: eq(agentTable.fid, fid),
  });

  return agent ?? null;
}

/**
 * Get an agent by creator FID
 * @param creatorFid - The Farcaster FID of the creator
 * @returns The agent or null if not found
 */
export async function getAgentByCreatorFid(
  creatorFid: number
): Promise<Agent | null> {
  const agent = await db.query.agentTable.findFirst({
    where: eq(agentTable.creatorFid, creatorFid),
  });

  return agent ?? null;
}

/**
 * Get all marketplace agents (excluding a specific FID)
 * @param excludeFid - Optional FID to exclude from results (e.g., user's own agent)
 * @returns Array of agents
 */
export async function getMarketplaceAgents(
  excludeFid?: number
): Promise<Agent[]> {
  const agents = await db.query.agentTable.findMany({
    where: excludeFid ? ne(agentTable.fid, excludeFid) : undefined,
    orderBy: (table, { desc }) => [desc(table.createdAt)],
  });

  return agents;
}

/**
 * Get all agents with a specific FID (for testing/filtering)
 * @param fid - The FID to filter by
 * @returns Array of agents
 */
export async function getAgentsByFid(fid: number): Promise<Agent[]> {
  const agents = await db.query.agentTable.findMany({
    where: eq(agentTable.fid, fid),
    orderBy: (table, { desc }) => [desc(table.createdAt)],
  });

  return agents;
}

/**
 * Create a new agent
 * @param agent - The agent data to insert
 * @returns The created agent
 */
export async function createAgent(
  agent: typeof agentTable.$inferInsert
): Promise<Agent> {
  const [newAgent] = await db.insert(agentTable).values(agent).returning();
  return newAgent;
}

/**
 * Update an agent
 * @param agentId - The agent ID
 * @param updates - The fields to update
 * @returns The updated agent
 */
export async function updateAgent(
  agentId: string,
  updates: Partial<Agent>
): Promise<Agent> {
  const [updatedAgent] = await db
    .update(agentTable)
    .set(updates)
    .where(eq(agentTable.id, agentId))
    .returning();

  return updatedAgent;
}

/**
 * Delete an agent
 * @param agentId - The agent ID
 */
export async function deleteAgent(agentId: string): Promise<void> {
  await db.delete(agentTable).where(eq(agentTable.id, agentId));
}
