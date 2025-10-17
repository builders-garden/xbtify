import { isAddress } from "viem";
import { getUserFromFid } from "@/lib/database/queries/user.query";
import { getUserFromWalletAddress } from "@/lib/database/queries/wallet.query";
import type { User } from "@/types/user.type";
import { userIsNotAdminAndIsNotProduction } from ".";

/**
 * Authenticate the user using a private api endpoint using fid or wallet address in the headers
 * @param fid - Farcaster ID
 * @param walletAddress - Wallet address
 * @returns {status: "ok" | "nok", user?: User, statusCode: number, error?: string}
 */
export const authenticateApi = async (
  fid: string | null,
  walletAddress: string | null
): Promise<{
  status: "ok" | "nok";
  user?: User;
  statusCode: number;
  error?: string;
}> => {
  if (!(fid || walletAddress)) {
    return { status: "nok", error: "Unauthorized", statusCode: 401 };
  }
  let authUser: User | null = null;
  if (fid) {
    if (Number.isNaN(Number(fid))) {
      console.error("Invalid fid", fid);
      return { status: "nok", error: "Unauthorized", statusCode: 401 };
    }
    if (userIsNotAdminAndIsNotProduction(Number(fid))) {
      console.error(
        "User is not admin and this is not production for fid",
        fid
      );
      return { status: "nok", error: "Unauthorized env", statusCode: 401 };
    }
    authUser = await getUserFromFid(Number(fid));
  } else if (walletAddress) {
    if (!isAddress(walletAddress)) {
      console.error("Invalid wallet address", walletAddress);
      return { status: "nok", error: "Unauthorized", statusCode: 401 };
    }
    authUser = await getUserFromWalletAddress(walletAddress as `0x${string}`);
  }
  if (!authUser) {
    console.error("User fid or wallet address not found", {
      fid,
      walletAddress,
    });
    return { status: "nok", error: "Unauthorized", statusCode: 404 };
  }
  return { status: "ok", user: authUser, statusCode: 200 };
};
