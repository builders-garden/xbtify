"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import ky from "ky";

type InitAgentRequest = {
  personality: string;
  tone: string;
  movieCharacter: string;
};

type AgentInfoResponse = {
  status: "ok" | "nok";
  data?: {
    id: string;
    fid: number;
    creatorFid: number;
    status: "initializing" | "ready" | "error" | "reinitializing";
    personality: string;
    tone: string;
    movieCharacter: string;
    username?: string;
    displayName?: string;
    avatarUrl?: string;
    styleProfilePrompt?: string;
    createdAt: string;
    updatedAt: string;
  };
  error?: string;
  message?: string;
};

/**
 * Hook to initialize an agent via the AI service
 */
export function useInitAgent() {
  return useMutation({
    mutationFn: async (data: InitAgentRequest) => {
      const response = await ky.post("/api/agent/init", {
        json: data,
        credentials: "include",
      });

      return response.json();
    },
  });
}

/**
 * Hook to poll agent info from the AI service
 * This is used to check the initialization status
 */
export function useAgentInfo(
  fid: number | null,
  options?: { enabled?: boolean; refetchInterval?: number }
) {
  return useQuery<AgentInfoResponse>({
    queryKey: ["agent-info", fid],
    queryFn: async () => {
      if (!fid) {
        throw new Error("FID is required");
      }

      const response = await ky.get(`/api/agent/${fid}/info`, {
        credentials: "include",
      });

      return response.json();
    },
    enabled: options?.enabled ?? false,
    refetchInterval: options?.refetchInterval,
  });
}
