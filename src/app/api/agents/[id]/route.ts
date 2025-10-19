import { NextResponse } from "next/server";
import { getAgentById } from "@/lib/database/queries/agent.query";
import { fetchUserFromNeynar } from "@/lib/neynar";
import type { MarketplaceAgent } from "@/types/agent.type";

/**
 * GET /api/agents/[id]
 * Fetch a single agent by ID
 */
export async function GET(
  _: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id: agentId } = await params;

    // Fetch agent from database
    const agent = await getAgentById(agentId);

    if (!agent) {
      return NextResponse.json(
        { status: "nok", error: "Agent not found" },
        { status: 404 }
      );
    }

    // Fetch Neynar data for bio and follower count
    const neynarUser = await fetchUserFromNeynar(agent.fid.toString());

    // Transform database agent to marketplace format
    const marketplaceAgent: MarketplaceAgent = {
      id: agent.id,
      username: agent.username || "unknown",
      displayName: agent.displayName || agent.username || "Agent",
      bio: neynarUser?.profile?.bio?.text || "An AI agent vibing on Farcaster",
      avatarUrl: agent.avatarUrl || undefined,
      messageCount: 0, // TODO: Calculate from activities when available
      followerCount: neynarUser?.follower_count || 0,
      externalUrl: agent.username
        ? `https://warpcast.com/${agent.username}`
        : "https://warpcast.com",
      // Include agent configuration for detail view
      personality: agent.personality || undefined,
      tone: agent.tone || undefined,
      movieCharacter: agent.movieCharacter || undefined,
      styleProfilePrompt: agent.styleProfilePrompt || undefined,
      address: agent.address || undefined,
    };

    return NextResponse.json(
      { status: "ok", agent: marketplaceAgent },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching agent:", err);
    return NextResponse.json(
      {
        status: "nok",
        error: err instanceof Error ? err.message : "Failed to fetch agent",
      },
      { status: 500 }
    );
  }
}
