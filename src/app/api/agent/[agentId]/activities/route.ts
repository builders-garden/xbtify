import { type NextRequest, NextResponse } from "next/server";
import { authenticateApi } from "@/utils/authenticate-api";

/**
 * GET /api/agent/[agentId]/activities
 * Fetch activities for a specific agent
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  const fid = request.headers.get("x-user-fid");
  const walletAddress = request.headers.get("x-user-wallet-address");

  // Check if the user is authenticated
  const {
    status,
    user: authUser,
    statusCode,
    error,
  } = await authenticateApi(fid, walletAddress);

  if (status === "nok" || error || !authUser) {
    return NextResponse.json({ status: "nok", error }, { status: statusCode });
  }

  try {
    const { agentId } = await params;

    // TODO: Verify the agent belongs to the authenticated user
    // TODO: Fetch activities from database
    // const activities = await getAgentActivities(agentId);
    console.log("Fetching activities for agent:", agentId);

    // Mock response for now
    const mockActivities = [
      {
        id: "1",
        type: "answer",
        agentReply: "Just vibing with the new crypto trends! 🚀",
        originalMessage: "@agent what do you think about the market?",
        originalUser: {
          username: "cryptofan",
          fid: 12345,
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        status: "approved",
      },
      {
        id: "2",
        type: "review",
        agentReply: "Hmm, that's a spicy take! Let me think about it... 🤔",
        originalMessage: "@agent controversial opinion on ETH?",
        originalUser: {
          username: "ethmaxi",
          fid: 67890,
        },
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        status: "pending",
      },
    ];

    return NextResponse.json(
      { status: "ok", activities: mockActivities },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching activities:", err);
    return NextResponse.json(
      {
        status: "nok",
        error:
          err instanceof Error ? err.message : "Failed to fetch activities",
      },
      { status: 500 }
    );
  }
}
