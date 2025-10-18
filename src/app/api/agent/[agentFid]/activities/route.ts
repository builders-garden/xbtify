import { type NextRequest, NextResponse } from "next/server";
import { getAgentCastsByAgentFid } from "@/lib/database/queries/agent-cast.query";
import { authenticateApi } from "@/utils/authenticate-api";

/**
 * GET /api/agent/[agentId]/activities
 * Fetch activities for a specific agent
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ agentFid: string }> }
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
    const { agentFid } = await params;

    console.log("agent fid", agentFid);

    if (!agentFid) {
      return NextResponse.json(
        { status: "nok", error: "Agent FID is required" },
        { status: 400 }
      );
    }

    if (Number.isNaN(Number.parseInt(agentFid, 10))) {
      return NextResponse.json(
        { status: "nok", error: "Invalid agent FID" },
        { status: 400 }
      );
    }

    // TODO: Verify the agent belongs to the authenticated user
    const activities = await getAgentCastsByAgentFid(
      Number.parseInt(agentFid, 10),
      {
        includeParentUserMetadata: true,
      }
    );

    return NextResponse.json({ status: "ok", activities }, { status: 200 });
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
