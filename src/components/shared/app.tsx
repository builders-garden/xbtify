"use client";

import type { ReactNode } from "react";
import { AppProvider } from "@/contexts/app-context";
import { useAuth } from "@/contexts/auth-context";
import { useFarcaster } from "@/contexts/farcaster-context";
import type { PageContent } from "@/types/enums";
import type { OverlayConfig } from "@/types/overlay.type";
import { LoginIcon } from "./icons/login-icon";

type AppProps = {
  children: ReactNode;
  initialPageContent?: PageContent;
  initialOverlayContent?: OverlayConfig;
};

export default function App({
  children,
  initialPageContent,
  initialOverlayContent,
}: AppProps) {
  const { context, isInMiniApp, isMiniAppReady } = useFarcaster();
  const { error, isLoading, isSignedIn } = useAuth();

  return (
    <main className="mx-auto h-screen w-screen max-w-md overflow-hidden">
      {!isMiniAppReady && context && !isInMiniApp ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-black/80" />
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-green-500 border-t-transparent" />
            <p className="font-medium text-black text-xl">Loading...</p>
          </div>
        </div>
      ) : null}
      {error && isInMiniApp ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80" />
          <div className="relative z-10 flex w-fit max-w-md flex-col items-center gap-8 px-4">
            <div className="rounded-lg border-2 border-red-500 bg-red-500/20 p-6 backdrop-blur-sm">
              <p className="text-center font-medium text-lg text-red-100">
                {error.message}
              </p>
            </div>
          </div>
        </div>
      ) : null}
      {isMiniAppReady && !isSignedIn && !error && !isInMiniApp ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="relative z-10 flex w-fit max-w-md flex-col items-center gap-8 px-4">
            <LoginIcon />
            <p className="text-center font-medium text-black text-lg">
              {isLoading ? "Signing in..." : "Signed in"}
            </p>
          </div>
        </div>
      ) : null}

      <AppProvider
        initialOverlayContent={initialOverlayContent}
        initialPageContent={initialPageContent}
      >
        {children}
      </AppProvider>
    </main>
  );
}
