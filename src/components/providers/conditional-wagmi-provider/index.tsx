"use client";

import { sdk as miniappSdk } from "@farcaster/miniapp-sdk";
import type { ReactNode } from "react";
import { useLayoutEffect, useState } from "react";
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
  const [isInMiniApp, setIsInMiniApp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    const checkIsInMiniApp = async () => {
      const tmpIsInMiniApp = await miniappSdk.isInMiniApp();
      setIsInMiniApp(tmpIsInMiniApp);
      setIsLoading(false);
    };
    checkIsInMiniApp();
  }, []);

  if (isLoading) {
    // Show loading while detecting environment
    return <div>Loading...</div>;
  }

  if (isInMiniApp) {
    // Use MiniApp Wagmi config for Farcaster environment
    return (
      <CustomWagmiProvider config={wagmiConfigMiniApp} cookie={cookie}>
        {children}
      </CustomWagmiProvider>
    );
  }
};
