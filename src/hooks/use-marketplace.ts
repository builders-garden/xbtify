"use client";

import type { MarketplaceAgent } from "@/types/agent.type";
import { useApiQuery } from "./use-api-query";

type MarketplaceAgentsResponse = {
  status: "ok" | "nok";
  agents: MarketplaceAgent[];
};

/**
 * Hook to fetch marketplace agents
 */
export function useMarketplaceAgents() {
  const query = useApiQuery<MarketplaceAgentsResponse>({
    queryKey: ["marketplace", "agents"],
    url: "/api/marketplace/agents",
  });

  return {
    ...query,
    data: query.data?.agents || [],
  };
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
