import { type NextRequest, NextResponse } from "next/server";
import {
  getAgentByCreatorFid,
  updateAgent,
} from "@/lib/database/queries/agent.query";
import { updateUserProfile } from "@/lib/neynar";
import { authenticateApi } from "@/utils/authenticate-api";

/**
 * PATCH /api/agent/profile
 * Update the agent's Farcaster profile (bio, pfp, display_name, username)
 * This will update both the database and Neynar
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

    // Validate that only profile fields are being updated
    const allowedFields = [
      "bio",
      "avatarUrl",
      "displayName",
      "username",
      "url",
    ];

    const updates: {
      bio?: string;
      avatarUrl?: string;
      displayName?: string;
      username?: string;
      url?: string;
    } = {};

    for (const field of allowedFields) {
      if (field in body && body[field] !== undefined) {
        updates[field as keyof typeof updates] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { status: "nok", error: "No valid profile fields to update" },
        { status: 400 }
      );
    }

    if (!authUser.farcasterFid) {
      return NextResponse.json(
        { status: "nok", error: "User does not have a Farcaster FID" },
        { status: 400 }
      );
    }

    console.log("Updating profile for FID:", authUser.farcasterFid);

    // Fetch the agent
    const agent = await getAgentByCreatorFid(authUser.farcasterFid);

    if (!agent) {
      return NextResponse.json(
        { status: "nok", error: "Agent not found" },
        { status: 404 }
      );
    }

    // Check if signerUuid exists
    if (!agent.signerUuid) {
      return NextResponse.json(
        {
          status: "nok",
          error: "Agent does not have a signer UUID. Cannot update profile.",
        },
        { status: 400 }
      );
    }

    // Map database fields to Neynar API fields
    const neynarUpdates: {
      bio?: string;
      pfp_url?: string;
      display_name?: string;
      username?: string;
      url?: string;
    } = {};

    if (updates.bio !== undefined) {
      neynarUpdates.bio = updates.bio;
    }
    if (updates.avatarUrl !== undefined) {
      neynarUpdates.pfp_url = updates.avatarUrl;
    }
    if (updates.displayName !== undefined) {
      neynarUpdates.display_name = updates.displayName;
    }
    if (updates.username !== undefined) {
      neynarUpdates.username = updates.username;
    }
    if (updates.url !== undefined) {
      neynarUpdates.url = updates.url;
    }

    // Update Neynar profile first
    try {
      const neynarResponse = await updateUserProfile(
        agent.signerUuid,
        neynarUpdates
      );

      if (!neynarResponse.success) {
        return NextResponse.json(
          {
            status: "nok",
            error: `Failed to update Neynar profile: ${neynarResponse.message}`,
          },
          { status: 400 }
        );
      }
    } catch (neynarError) {
      console.error("Error updating Neynar profile:", neynarError);
      return NextResponse.json(
        {
          status: "nok",
          error:
            neynarError instanceof Error
              ? neynarError.message
              : "Failed to update profile on Neynar",
        },
        { status: 500 }
      );
    }

    // Update the agent in the database
    const updatedAgent = await updateAgent(agent.id, updates);

    return NextResponse.json(
      {
        status: "ok",
        agent: updatedAgent,
        message: "Profile updated successfully",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating agent profile:", err);
    return NextResponse.json(
      {
        status: "nok",
        error:
          err instanceof Error ? err.message : "Failed to update agent profile",
      },
      { status: 500 }
    );
  }
}
