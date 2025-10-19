import { type NextRequest, NextResponse } from "next/server";
import {
  getAgentByCreatorFid,
  updateAgent,
} from "@/lib/database/queries/agent.query";
import { updateUserProfile } from "@/lib/neynar";
import { createAgentSchema } from "@/lib/schemas/agent.schema";
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
    // Fetch agent from database using Farcaster FID
    if (!authUser.farcasterFid) {
      return NextResponse.json(
        { status: "nok", error: "User does not have a Farcaster FID" },
        { status: 400 }
      );
    }

    // const agent = await getAgentByFid(1391657);
    const agent = await getAgentByCreatorFid(authUser.farcasterFid);

    if (!agent) {
      return NextResponse.json(
        { status: "nok", error: "Agent not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ status: "ok", agent }, { status: 200 });
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

    // For now, we expect the full agent data from onboarding
    // The createAgentSchema only validates personality, but we'll accept more fields
    const parsed = createAgentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { status: "nok", error: parsed.error.message },
        { status: 400 }
      );
    }

    if (!authUser.farcasterFid) {
      return NextResponse.json(
        { status: "nok", error: "User does not have a Farcaster FID" },
        { status: 400 }
      );
    }

    // TODO: Implement createAgent with full onboarding data
    // For now, check if agent already exists
    const existingAgent = await getAgentByCreatorFid(authUser.farcasterFid);

    if (existingAgent) {
      return NextResponse.json(
        { status: "nok", error: "Agent already exists for this user" },
        { status: 409 }
      );
    }

    // Return error until we implement full creation
    return NextResponse.json(
      { status: "nok", error: "Agent creation not yet implemented" },
      { status: 501 }
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

    // Validate that only allowed fields are being updated
    const allowedFields = [
      "personality",
      "tone",
      "movieCharacter",
      "styleProfilePrompt",
      "topicPatternsPrompt",
      "keywords",
      "bio",
      "avatarUrl",
      "displayName",
      "username",
    ];

    const updates: Partial<typeof body> = {};
    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { status: "nok", error: "No valid fields to update" },
        { status: 400 }
      );
    }

    if (!authUser.farcasterFid) {
      return NextResponse.json(
        { status: "nok", error: "User does not have a Farcaster FID" },
        { status: 400 }
      );
    }

    // const agent = await getAgentByFid(1391657);
    const agent = await getAgentByCreatorFid(authUser.farcasterFid);

    if (!agent) {
      return NextResponse.json(
        { status: "nok", error: "Agent not found" },
        { status: 404 }
      );
    }

    // Check if we need to update Neynar profile
    const neynarUpdates: {
      bio?: string;
      pfp_url?: string;
      username?: string;
      display_name?: string;
    } = {};

    if ("bio" in updates && updates.bio !== undefined) {
      neynarUpdates.bio = updates.bio;
    }
    if ("avatarUrl" in updates && updates.avatarUrl !== undefined) {
      neynarUpdates.pfp_url = updates.avatarUrl;
    }
    if ("username" in updates && updates.username !== undefined) {
      neynarUpdates.username = updates.username;
    }
    if ("displayName" in updates && updates.displayName !== undefined) {
      neynarUpdates.display_name = updates.displayName;
    }

    // Update Neynar profile if there are relevant changes and signerUuid exists
    if (Object.keys(neynarUpdates).length > 0 && agent.signerUuid) {
      try {
        await updateUserProfile(agent.signerUuid, neynarUpdates);
      } catch (neynarError) {
        console.error("Error updating Neynar profile:", neynarError);
        // Continue with database update even if Neynar update fails
        // You might want to return a warning to the user
      }
    }

    // Update the agent in the database
    const updatedAgent = await updateAgent(agent.id, updates);

    return NextResponse.json(
      { status: "ok", agent: updatedAgent },
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
    if (!authUser.farcasterFid) {
      return NextResponse.json(
        { status: "nok", error: "User does not have a Farcaster FID" },
        { status: 400 }
      );
    }

    const agent = await getAgentByCreatorFid(authUser.farcasterFid);

    if (!agent) {
      return NextResponse.json(
        { status: "nok", error: "Agent not found" },
        { status: 404 }
      );
    }

    // TODO: Implement deleteAgent in database
    return NextResponse.json(
      { status: "nok", error: "Agent deletion not yet implemented" },
      { status: 501 }
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
