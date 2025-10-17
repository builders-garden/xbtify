import { type NextRequest, NextResponse } from "next/server";
import { authenticateApi } from "@/utils/authenticate-api";

export async function GET(request: NextRequest) {
  const fid = request.headers.get("x-user-fid");
  const walletAddress = request.headers.get("x-user-wallet-address");

  const {
    status,
    user: authUser,
    error,
  } = await authenticateApi(fid, walletAddress);

  if (status === "nok" || error || !authUser) {
    return NextResponse.json({ status: "nok" }, { status: 200 });
  }

  return NextResponse.json({ status: "ok", user: authUser }, { status: 200 });
}
