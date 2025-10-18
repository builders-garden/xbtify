import { NextResponse } from "next/server";
import { getAgentsByFid } from "@/lib/database/queries/agent.query";
import { fetchBulkUsersFromNeynar } from "@/lib/neynar";
import type { MarketplaceAgent } from "@/types/agent.type";

/**
 * GET /api/marketplace/agents
 * Fetch all marketplace agents
 * Currently filtered to show only agents with fid = 1391657
 * No authentication required - this is public data
 */
export async function GET() {
  try {
    // Fetch agents with specific FID (for testing)
    const TARGET_FID = 1391657;
    const agents = await getAgentsByFid(TARGET_FID);

    // Fetch Neynar data for all agents to get follower counts
    const fids = agents.map((agent) => agent.fid).join(",");
    const neynarUsers =
      fids.length > 0 ? await fetchBulkUsersFromNeynar(fids) : [];

    // Create a map of fid to neynar user for quick lookup
    const neynarUserMap = new Map(neynarUsers.map((user) => [user.fid, user]));

    // Transform database agents to marketplace format
    const marketplaceAgents: MarketplaceAgent[] = agents.map((agent) => {
      const neynarUser = neynarUserMap.get(agent.fid);

      return {
        id: agent.id,
        username: agent.username || "unknown",
        displayName: agent.displayName || agent.username || "Agent",
        bio:
          neynarUser?.profile?.bio?.text || "An AI agent vibing on Farcaster",
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
    });

    return NextResponse.json(
      { status: "ok", agents: marketplaceAgents },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching marketplace agents:", err);
    return NextResponse.json(
      {
        status: "nok",
        error:
          err instanceof Error
            ? err.message
            : "Failed to fetch marketplace agents",
      },
      { status: 500 }
    );
  }
}
