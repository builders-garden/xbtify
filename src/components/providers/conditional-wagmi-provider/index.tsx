"use client";

import type { ReactNode } from "react";
import { wagmiConfigMiniApp } from "@/lib/wagmi";
import { CustomWagmiProvider } from "./wagmi-provider";

type ConditionalWagmiProviderProps = {
  children: ReactNode;
  cookie: string | null;
};

export const ConditionalWagmiProvider = ({
  children,
  cookie,
}: ConditionalWagmiProviderProps) => {
  // Use MiniApp Wagmi config for Farcaster environment
  return (
    <CustomWagmiProvider config={wagmiConfigMiniApp} cookie={cookie}>
      {children}
    </CustomWagmiProvider>
  );
};
