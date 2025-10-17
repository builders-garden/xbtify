import { type NextRequest, NextResponse } from "next/server";
import { activityActionSchema } from "@/lib/schemas/agent.schema";
import { authenticateApi } from "@/utils/authenticate-api";

/**
 * POST /api/activities/[activityId]/reject
 * Reject an activity
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ activityId: string }> }
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
    const { activityId } = await params;
    const body = await request.json();
    const parsed = activityActionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { status: "nok", error: parsed.error.message },
        { status: 400 }
      );
    }

    // TODO: Verify the activity belongs to the user's agent
    // TODO: Update activity status in database
    // const activity = await rejectActivity(activityId, parsed.data.agentId);

    console.log(
      "Rejecting activity:",
      activityId,
      "for agent:",
      parsed.data.agentId
    );

    // Mock response for now
    const mockActivity = {
      id: activityId,
      type: "review",
      agentReply: "This is controversial...",
      originalMessage: "@agent what's your opinion?",
      originalUser: {
        username: "user456",
        fid: 67890,
      },
      timestamp: new Date(),
      status: "rejected",
    };

    return NextResponse.json(
      { status: "ok", activity: mockActivity },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error rejecting activity:", err);
    return NextResponse.json(
      {
        status: "nok",
        error: err instanceof Error ? err.message : "Failed to reject activity",
      },
      { status: 500 }
    );
  }
}
