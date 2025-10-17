"use client";

import { useQueryClient } from "@tanstack/react-query";
import type { Agent } from "@/types/agent.type";
import { useApiMutation } from "./use-api-mutation";
import { useApiQuery } from "./use-api-query";

/**
 * Hook to fetch the current user's agent
 */
export function useAgent() {
  return useApiQuery<Agent>({
    queryKey: ["agent"],
    url: "/api/agent",
  });
}

/**
 * Hook to create a new agent for the current user
 */
export function useCreateAgent() {
  const queryClient = useQueryClient();

  return useApiMutation<Agent, { personality?: string }>({
    mutationKey: ["createAgent"],
    url: "/api/agent",
    method: "POST",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent"] });
    },
  });
}

/**
 * Hook to update the current user's agent
 */
export function useUpdateAgent() {
  const queryClient = useQueryClient();

  return useApiMutation<Agent, Partial<Agent>>({
    mutationKey: ["updateAgent"],
    url: "/api/agent",
    method: "PATCH",
    body: (variables) => variables,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent"] });
    },
  });
}

/**
 * Hook to delete the current user's agent
 */
export function useDeleteAgent() {
  const queryClient = useQueryClient();

  return useApiMutation<void, void>({
    mutationKey: ["deleteAgent"],
    url: "/api/agent",
    method: "DELETE",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent"] });
    },
  });
}
