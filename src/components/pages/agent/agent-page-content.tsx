"use client";

import { useRouter } from "next/navigation";
import type { MarketplaceAgent } from "@/types/agent.type";
import { AgentDetailView } from "./agent-detail-view";

type AgentPageContentProps = {
  agent: MarketplaceAgent;
};

export function AgentPageContent({ agent }: AgentPageContentProps) {
  const router = useRouter();

  const handleBack = () => {
    // Navigate to home page instead of going back
    router.push("/");
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 pt-6">
      <AgentDetailView agent={agent} label="Home" onBack={handleBack} />
    </div>
  );
}
