"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ResolvedRegister } from "@wagmi/core";
import type { ReactNode } from "react";
import { cookieToInitialState, WagmiProvider } from "wagmi";

const queryClient = new QueryClient();

type CustomWagmiProviderProps = {
  config: ResolvedRegister["config"]; // wagmi config
  children: ReactNode;
  cookie: string | null;
};

export const CustomWagmiProvider = ({
  config,
  children,
  cookie,
}: CustomWagmiProviderProps) => {
  const initialState = cookieToInitialState(config, cookie);
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
};
