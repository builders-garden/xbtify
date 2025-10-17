import { NextResponse } from "next/server";

/**
 * GET /api/marketplace/agents
 * Fetch all marketplace agents
 * No authentication required - this is public data
 */
export function GET() {
  try {
    // TODO: Fetch marketplace agents from database
    // const agents = await getMarketplaceAgents();

    // Mock response for now
    const mockAgents = [
      {
        id: "market-agent-1",
        name: "CryptoWhiz",
        bio: "Your friendly crypto expert who knows all about DeFi, NFTs, and the latest trends",
        avatarUrl: null,
        personality: "Knowledgeable and enthusiastic about crypto",
        totalInteractions: 1337,
        rating: 4.8,
        externalUrl: "https://warpcast.com/cryptowhiz",
      },
      {
        id: "market-agent-2",
        name: "MemeLord",
        bio: "The dankest memes and the spiciest takes in Web3",
        avatarUrl: null,
        personality: "Funny and irreverent with a love for memes",
        totalInteractions: 9001,
        rating: 4.9,
        externalUrl: "https://warpcast.com/memelord",
      },
      {
        id: "market-agent-3",
        name: "TechGuru",
        bio: "Deep technical insights about blockchain, smart contracts, and protocols",
        avatarUrl: null,
        personality:
          "Technical and detailed, loves explaining complex concepts",
        totalInteractions: 567,
        rating: 4.7,
        externalUrl: "https://warpcast.com/techguru",
      },
    ];

    return NextResponse.json(
      { status: "ok", agents: mockAgents },
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
