import { type NextRequest, NextResponse } from "next/server";
import { activityActionSchema } from "@/lib/schemas/agent.schema";
import { authenticateApi } from "@/utils/authenticate-api";

/**
 * POST /api/activities/[activityId]/approve
 * Approve an activity
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
    // const activity = await approveActivity(activityId, parsed.data.agentId);

    console.log(
      "Approving activity:",
      activityId,
      "for agent:",
      parsed.data.agentId
    );

    // Mock response for now
    const mockActivity = {
      id: activityId,
      type: "answer",
      agentReply: "Great question! Here's my take...",
      originalMessage: "@agent what do you think?",
      originalUser: {
        username: "user123",
        fid: 12345,
      },
      timestamp: new Date(),
      status: "approved",
    };

    return NextResponse.json(
      { status: "ok", activity: mockActivity },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error approving activity:", err);
    return NextResponse.json(
      {
        status: "nok",
        error:
          err instanceof Error ? err.message : "Failed to approve activity",
      },
      { status: 500 }
    );
  }
}
