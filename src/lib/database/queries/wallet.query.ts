import { eq } from "drizzle-orm";
import { type Address, getAddress } from "viem";
import { db } from "@/lib/database";
import { walletTable } from "@/lib/database/db.schema";
import {
  getBasenameAvatar,
  getBasenameName,
  getEnsAvatar,
  getEnsName,
} from "@/lib/ens/client";
import type { User } from "@/types/user.type";

/**
 * Add wallets to a user
 * @param userId - The database ID of the user
 * @param addresses - The addresses to add to the user
 * @returns The added wallets
 */
export const addUserWallets = async (
  userId: string,
  addresses: { address: Address; isPrimary: boolean }[]
) => {
  const [ensName, baseName] = await Promise.all([
    getEnsName(addresses[0].address),
    getBasenameName(addresses[0].address),
  ]);
  const [ensAvatar, baseAvatar] = await Promise.all([
    getEnsAvatar(ensName?.normalize() || ""),
    getBasenameAvatar(baseName?.normalize() || ""),
  ]);
  const dbWallets = await db
    .insert(walletTable)
    .values(
      addresses.map((address) => ({
        address: getAddress(address.address),
        ensName: ensName?.normalize() || null,
        baseName: baseName?.normalize() || null,
        ensAvatarUrl: ensAvatar || null,
        baseAvatarUrl: baseAvatar || null,
        userId,
        isPrimary: address.isPrimary,
      }))
    )
    .returning();
  return dbWallets;
};

/**
 * Get a user from their wallet address
 * @param address - The wallet address
 * @returns The user or null if the user is not found
 */
export const getUserFromWalletAddress = async (
  notNormalizedAddress: Address
): Promise<User | null> => {
  const address = getAddress(notNormalizedAddress);

  const wallets = await db.query.walletTable.findMany({
    where: eq(walletTable.address, address),
    with: {
      user: {
        with: {
          wallets: true,
        },
      },
    },
  });
  if (!wallets) {
    return null;
  }

  const [user] = wallets.map((wallet) => wallet.user);
  if (!user) {
    return null;
  }

  return user;
};
