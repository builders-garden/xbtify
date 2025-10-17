import { type NextRequest, NextResponse } from "next/server";
import {
  createAgentSchema,
  updateAgentSchema,
} from "@/lib/schemas/agent.schema";
import { authenticateApi } from "@/utils/authenticate-api";

/**
 * GET /api/agent
 * Fetch the authenticated user's agent
 */
export async function GET(request: NextRequest) {
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
    // TODO: Fetch agent from database
    // const agent = await getAgentByUserId(authUser.id);

    // Mock response for now
    const mockAgent = {
      id: "agent-1",
      userId: authUser.id,
      name: authUser.farcasterUsername || authUser.username || "Agent",
      bio: authUser.farcasterDisplayName || null,
      avatarUrl: authUser.farcasterAvatarUrl || authUser.avatarUrl || null,
      personality: "A friendly and helpful AI agent",
      chaosLevel: 50,
      autoRespond: true,
      dmEnabled: false,
      totalInteractions: 42,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json(
      { status: "ok", agent: mockAgent },
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

/**
 * POST /api/agent
 * Create a new agent for the authenticated user
 */
export async function POST(request: NextRequest) {
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
    const body = await request.json();
    const parsed = createAgentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { status: "nok", error: parsed.error.message },
        { status: 400 }
      );
    }

    // TODO: Create agent in database
    // const agent = await createAgent({
    //   userId: authUser.id,
    //   personality: parsed.data.personality,
    // });

    // Mock response for now
    const mockAgent = {
      id: "agent-1",
      userId: authUser.id,
      name: authUser.farcasterUsername || authUser.username || "Agent",
      bio: authUser.farcasterDisplayName || null,
      avatarUrl: authUser.farcasterAvatarUrl || authUser.avatarUrl || null,
      personality: parsed.data.personality || "A friendly and helpful AI agent",
      chaosLevel: 50,
      autoRespond: true,
      dmEnabled: false,
      totalInteractions: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json(
      { status: "ok", agent: mockAgent },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating agent:", err);
    return NextResponse.json(
      {
        status: "nok",
        error: err instanceof Error ? err.message : "Failed to create agent",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/agent
 * Update the authenticated user's agent
 */
export async function PATCH(request: NextRequest) {
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
    const body = await request.json();
    const parsed = updateAgentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { status: "nok", error: parsed.error.message },
        { status: 400 }
      );
    }

    // TODO: Update agent in database
    // const agent = await updateAgent(authUser.id, parsed.data);

    // Mock response for now
    const mockAgent = {
      id: "agent-1",
      userId: authUser.id,
      name: authUser.farcasterUsername || authUser.username || "Agent",
      bio: authUser.farcasterDisplayName || null,
      avatarUrl: authUser.farcasterAvatarUrl || authUser.avatarUrl || null,
      personality: parsed.data.personality || "A friendly and helpful AI agent",
      chaosLevel: parsed.data.chaosLevel ?? 50,
      autoRespond: parsed.data.autoRespond ?? true,
      dmEnabled: parsed.data.dmEnabled ?? false,
      totalInteractions: 42,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json(
      { status: "ok", agent: mockAgent },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating agent:", err);
    return NextResponse.json(
      {
        status: "nok",
        error: err instanceof Error ? err.message : "Failed to update agent",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/agent
 * Delete the authenticated user's agent
 */
export async function DELETE(request: NextRequest) {
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
    // TODO: Delete agent from database
    // await deleteAgent(authUser.id);

    return NextResponse.json(
      { status: "ok", message: "Agent deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting agent:", err);
    return NextResponse.json(
      {
        status: "nok",
        error: err instanceof Error ? err.message : "Failed to delete agent",
      },
      { status: 500 }
    );
  }
}
