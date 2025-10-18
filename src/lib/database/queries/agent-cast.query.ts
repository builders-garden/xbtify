import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/database";
import {
  type AgentCast,
  agentCastTable,
  type CreateAgentCast,
} from "@/lib/database/db.schema";
import type { AgentCastsWithParentUserMetadata } from "@/types/agent.type";

/**
 * Get an agent cast by ID
 * @param castId - The agent cast ID
 * @returns The agent cast or null if not found
 */
export async function getAgentCastById(
  castId: string
): Promise<AgentCast | null> {
  const cast = await db.query.agentCastTable.findFirst({
    where: eq(agentCastTable.id, castId),
  });

  return cast ?? null;
}

/**
 * Get an agent cast by cast hash
 * @param castHash - The cast hash
 * @returns The agent cast or null if not found
 */
export async function getAgentCastByHash(
  castHash: string
): Promise<AgentCast | null> {
  const cast = await db.query.agentCastTable.findFirst({
    where: eq(agentCastTable.castHash, castHash),
  });

  return cast ?? null;
}

/**
 * Get all casts by an agent
 * @param agentFid - The agent's Farcaster FID
 * @param limit - Optional limit for number of results
 * @returns Array of agent casts
 */
export async function getAgentCastsByAgentFid(
  agentFid: number,
  options: {
    includeParentUserMetadata?: boolean;
    limit?: number;
  }
): Promise<AgentCastsWithParentUserMetadata[]> {
  const casts = await db.query.agentCastTable.findMany({
    where: eq(agentCastTable.agentFid, agentFid),
    orderBy: [desc(agentCastTable.createdAt)],
    limit: options.limit,
    ...(options.includeParentUserMetadata
      ? {
          with: {
            parentUserMetadata: true,
          },
        }
      : {}),
  });

  return casts;
}

/**
 * Get all replies by an agent (casts with a parent)
 * @param agentFid - The agent's Farcaster FID
 * @param limit - Optional limit for number of results
 * @returns Array of agent cast replies
 */
export async function getAgentRepliesByAgentFid(
  agentFid: number,
  limit?: number
): Promise<AgentCast[]> {
  const replies = await db
    .select()
    .from(agentCastTable)
    .where(
      and(
        eq(agentCastTable.agentFid, agentFid),
        eq(agentCastTable.parentCastHash, agentCastTable.parentCastHash) // This ensures parentCastHash is not null
      )
    )
    .orderBy(desc(agentCastTable.createdAt))
    .limit(limit ?? 100);

  return replies.filter((cast) => cast.parentCastHash !== null);
}

/**
 * Get all original casts by an agent (casts without a parent)
 * @param agentFid - The agent's Farcaster FID
 * @param limit - Optional limit for number of results
 * @returns Array of agent cast originals
 */
export async function getAgentOriginalCastsByAgentFid(
  agentFid: number,
  limit?: number
): Promise<AgentCast[]> {
  const casts = await db
    .select()
    .from(agentCastTable)
    .where(eq(agentCastTable.agentFid, agentFid))
    .orderBy(desc(agentCastTable.createdAt))
    .limit(limit ?? 100);

  return casts.filter((cast) => cast.parentCastHash === null);
}

/**
 * Get all replies to a specific cast
 * @param parentCastHash - The parent cast hash
 * @returns Array of agent casts that are replies to the parent
 */
export async function getAgentRepliesByParentHash(
  parentCastHash: string
): Promise<AgentCast[]> {
  const replies = await db.query.agentCastTable.findMany({
    where: eq(agentCastTable.parentCastHash, parentCastHash),
    orderBy: [desc(agentCastTable.createdAt)],
  });

  return replies;
}

/**
 * Get all casts by an agent replying to a specific author
 * @param agentFid - The agent's Farcaster FID
 * @param parentAuthorFid - The parent cast author's FID
 * @returns Array of agent casts
 */
export async function getAgentCastsByParentAuthor(
  agentFid: number,
  parentAuthorFid: number
): Promise<AgentCast[]> {
  const casts = await db.query.agentCastTable.findMany({
    where: and(
      eq(agentCastTable.agentFid, agentFid),
      eq(agentCastTable.parentCastAuthorFid, parentAuthorFid)
    ),
    orderBy: [desc(agentCastTable.createdAt)],
  });

  return casts;
}

/**
 * Create a new agent cast
 * @param cast - The agent cast data to insert
 * @returns The created agent cast
 */
export async function createAgentCast(
  cast: CreateAgentCast
): Promise<AgentCast> {
  const [newCast] = await db.insert(agentCastTable).values(cast).returning();
  return newCast;
}

/**
 * Create multiple agent casts in bulk
 * @param casts - Array of agent cast data to insert
 * @returns Array of created agent casts
 */
export async function createAgentCasts(
  casts: CreateAgentCast[]
): Promise<AgentCast[]> {
  const newCasts = await db.insert(agentCastTable).values(casts).returning();
  return newCasts;
}

/**
 * Update an agent cast
 * @param castId - The agent cast ID
 * @param updates - The fields to update
 * @returns The updated agent cast
 */
export async function updateAgentCast(
  castId: string,
  updates: Partial<AgentCast>
): Promise<AgentCast> {
  const [updatedCast] = await db
    .update(agentCastTable)
    .set(updates)
    .where(eq(agentCastTable.id, castId))
    .returning();

  return updatedCast;
}

/**
 * Delete an agent cast
 * @param castId - The agent cast ID
 */
export async function deleteAgentCast(castId: string): Promise<void> {
  await db.delete(agentCastTable).where(eq(agentCastTable.id, castId));
}

/**
 * Delete all casts by an agent
 * @param agentFid - The agent's Farcaster FID
 */
export async function deleteAgentCastsByAgentFid(
  agentFid: number
): Promise<void> {
  await db.delete(agentCastTable).where(eq(agentCastTable.agentFid, agentFid));
}

/**
 * Get the total count of casts by an agent
 * @param agentFid - The agent's Farcaster FID
 * @returns The count of casts
 */
export async function getAgentCastCount(agentFid: number): Promise<number> {
  const casts = await db
    .select()
    .from(agentCastTable)
    .where(eq(agentCastTable.agentFid, agentFid));

  return casts.length;
}

/**
 * Get recent casts across all agents
 * @param limit - Optional limit for number of results (default: 50)
 * @returns Array of recent agent casts
 */
export async function getRecentAgentCasts(limit = 50): Promise<AgentCast[]> {
  const casts = await db.query.agentCastTable.findMany({
    orderBy: [desc(agentCastTable.createdAt)],
    limit,
  });

  return casts;
}
