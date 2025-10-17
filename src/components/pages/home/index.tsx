"use client";

import Image from "next/image";
import { useAccount } from "wagmi";
import { useAuth } from "@/contexts/auth-context";
import { env } from "@/lib/env";
import { formatAvatarSrc, formatWalletAddress } from "@/utils";

export function HomePage() {
  const { user } = useAuth();
  const { address } = useAccount();

  return (
    <div className="flex flex-col items-center justify-center p-4 text-black">
      <div className="space-y-4 text-center">
        <h1 className="font-bold text-2xl">
          Welcome to {env.NEXT_PUBLIC_APPLICATION_NAME}
        </h1>
        <p className="text-lg text-muted-foreground">
          {address
            ? formatWalletAddress(address)
            : "Connect wallet to get started"}
        </p>
        <div className="space-y-4">
          {user ? (
            <div className="flex min-h-[160px] flex-col items-center justify-center space-y-2">
              {user.avatarUrl ? (
                <Image
                  alt="Profile"
                  className="size-20 rounded-full"
                  height={80}
                  src={formatAvatarSrc(user.avatarUrl)}
                  width={80}
                />
              ) : (
                <div className="size-20 rounded-full bg-muted" />
              )}
              <div className="text-center">
                {user.farcasterDisplayName ? (
                  <p className="font-semibold">{user.farcasterDisplayName}</p>
                ) : null}
                <p className="text-muted-foreground text-sm">
                  {user.username
                    ? `@${user.username}`
                    : formatWalletAddress(user.wallets[0].address)}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
