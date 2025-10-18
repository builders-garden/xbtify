"use client";

import { useQueryClient } from "@tanstack/react-query";
import type { Agent } from "@/lib/database/db.schema";
import { useApiMutation } from "./use-api-mutation";
import { useApiQuery } from "./use-api-query";

type AgentResponse = {
  status: "ok" | "nok";
  agent?: Agent;
  error?: string;
};

/**
 * Hook to fetch the current user's agent
 */
export function useAgent() {
  const query = useApiQuery<AgentResponse>({
    queryKey: ["agent"],
    url: "/api/agent",
  });

  return {
    ...query,
    data: query.data?.agent,
  };
}

/**
 * Hook to create a new agent for the current user
 */
export function useCreateAgent() {
  const queryClient = useQueryClient();

  const mutation = useApiMutation<AgentResponse, { personality?: string }>({
    mutationKey: ["createAgent"],
    url: "/api/agent",
    method: "POST",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent"] });
    },
  });

  return {
    ...mutation,
    mutateAsync: async (variables: { personality?: string }) => {
      const response = await mutation.mutateAsync(variables);
      return response.agent;
    },
  };
}

/**
 * Hook to update the current user's agent
 */
export function useUpdateAgent() {
  const queryClient = useQueryClient();

  const mutation = useApiMutation<AgentResponse, Partial<Agent>>({
    mutationKey: ["updateAgent"],
    url: "/api/agent",
    method: "PATCH",
    body: (variables) => variables,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent"] });
    },
  });

  return {
    ...mutation,
    mutateAsync: async (variables: Partial<Agent>) => {
      const response = await mutation.mutateAsync(variables);
      return response.agent;
    },
  };
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
