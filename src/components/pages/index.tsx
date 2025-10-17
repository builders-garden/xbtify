"use client";

import dynamic from "next/dynamic";
import { Maintenance } from "@/components/pages/mantainance";
import { useFarcaster } from "@/contexts/farcaster-context";
import { useMantainance } from "@/hooks/use-mantainance";
import type { PageContent } from "@/types/enums";
import type { OverlayConfig } from "@/types/overlay.type";

const App = dynamic(() => import("@/components/shared/app"), {
  ssr: false,
});

const AppWrapper = dynamic(() => import("@/components/shared/app-wrapper"), {
  ssr: false,
});

type AppProps = {
  initialPageContent?: PageContent;
  initialOverlayContent?: OverlayConfig;
  websitePage?: string;
};

export function AppPage({
  initialOverlayContent,
  initialPageContent,
}: // websitePage,
AppProps) {
  useFarcaster();
  const { data: maintenanceData } = useMantainance();

  // const isFromBrowser = (!context && isMiniAppReady) || (!context && !isMiniAppReady);

  // if (isFromBrowser) {return <Website page={websitePage} />;}
  if (maintenanceData?.isInMantainance) {
    return (
      <Maintenance
        maintenanceEnd={new Date(maintenanceData.mantainanceEndTime)}
      />
    );
  }

  return (
    <App
      initialOverlayContent={initialOverlayContent}
      initialPageContent={initialPageContent}
    >
      <AppWrapper />
    </App>
  );
}
