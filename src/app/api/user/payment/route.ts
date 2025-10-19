import { type NextRequest, NextResponse } from "next/server";
import { updateUser } from "@/lib/database/queries/user.query";
import { authenticateApi } from "@/utils/authenticate-api";
import { isValidTransactionHash } from "@/utils/transaction";

export async function PATCH(request: NextRequest) {
  const fid = request.headers.get("x-user-fid");
  const walletAddress = request.headers.get("x-user-wallet-address");

  // check if the user is authenticated
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
    const { paidTxHash } = body;

    if (!paidTxHash || typeof paidTxHash !== "string") {
      return NextResponse.json(
        { status: "nok", error: "Invalid transaction hash" },
        { status: 400 }
      );
    }

    // Basic validation for Ethereum transaction hash format
    if (!isValidTransactionHash(paidTxHash)) {
      return NextResponse.json(
        { status: "nok", error: "Invalid transaction hash format" },
        { status: 400 }
      );
    }

    // Update the user's payment transaction hash
    await updateUser(authUser.id, { paidTxHash });

    return NextResponse.json(
      {
        status: "ok",
        message: "Payment transaction hash updated successfully",
      },
      { status: 200 }
    );
  } catch (updateError) {
    console.error("Error updating payment transaction hash:", updateError);
    return NextResponse.json(
      { status: "nok", error: "Failed to update payment transaction hash" },
      { status: 500 }
    );
  }
}
