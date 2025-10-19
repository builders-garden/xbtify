import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { authenticateApi } from "@/utils/authenticate-api";

export async function POST(request: Request) {
  try {
    // Get auth headers
    const headerFid = request.headers.get("x-user-fid");
    const walletAddress = request.headers.get("x-user-wallet-address");

    // Authenticate the user
    const authResult = await authenticateApi(headerFid, walletAddress);
    if (authResult.status !== "ok" || !authResult.user) {
      return NextResponse.json(
        { status: "nok", error: authResult.error || "Unauthorized" },
        { status: authResult.statusCode }
      );
    }

    const user = authResult.user;

    // Get the request body
    const body = await request.json();
    const { personality, tone, movieCharacter } = body;

    // Validate required fields
    if (!personality) {
      return NextResponse.json(
        { status: "nok", error: "personality is required" },
        { status: 400 }
      );
    }
    if (!tone) {
      return NextResponse.json(
        { status: "nok", error: "tone is required" },
        { status: 400 }
      );
    }
    if (!movieCharacter) {
      return NextResponse.json(
        { status: "nok", error: "movieCharacter is required" },
        { status: 400 }
      );
    }

    // Get FID from user (assuming user has farcasterFid)
    const userFid = user.farcasterFid;
    if (!userFid) {
      return NextResponse.json(
        { status: "nok", error: "User does not have a Farcaster FID" },
        { status: 400 }
      );
    }

    // Call the AI service to initialize the agent
    const response = await fetch(`${env.AI_SERVICE_URL}/api/agent/init`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-secret": env.AI_SERVICE_API_KEY,
      },
      body: JSON.stringify({
        fid: userFid,
        personality,
        tone,
        movieCharacter,
        reinitialize: false,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          status: "nok",
          error: data.message || "Failed to initialize agent",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error initializing agent:", error);
    return NextResponse.json(
      {
        status: "nok",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
