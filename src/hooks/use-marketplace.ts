"use client";

import type { MarketplaceAgent } from "@/types/agent.type";
import { useApiQuery } from "./use-api-query";

/**
 * Hook to fetch marketplace agents
 */
export function useMarketplaceAgents() {
  return useApiQuery<MarketplaceAgent[]>({
    queryKey: ["marketplace", "agents"],
    url: "/api/marketplace/agents",
  });
}

/**
 * Hook to fetch a specific marketplace agent
 */
export function useMarketplaceAgent(agentId: string) {
  return useApiQuery<MarketplaceAgent>({
    queryKey: ["marketplace", "agent", agentId],
    url: `/api/marketplace/agents/${agentId}`,
    enabled: !!agentId,
  });
}
