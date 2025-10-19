import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { authenticateApi } from "@/utils/authenticate-api";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ agentFid: string }> }
) {
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

    // Await params in Next.js 15+
    const { agentFid } = await params;

    if (!agentFid) {
      return NextResponse.json(
        { status: "nok", error: "Agent FID is required" },
        { status: 400 }
      );
    }

    // Call the AI service to get agent info
    const response = await fetch(
      `${env.AI_SERVICE_URL}/api/agent/${agentFid}/info`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-secret": env.AI_SERVICE_API_KEY,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          status: "nok",
          error: data.message || "Failed to fetch agent info",
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching agent info:", error);
    return NextResponse.json(
      {
        status: "nok",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
