"use client";

import { useQueryClient } from "@tanstack/react-query";
import type { Activity } from "@/types/agent.type";
import { useApiMutation } from "./use-api-mutation";
import { useApiQuery } from "./use-api-query";

/**
 * Hook to fetch activities for an agent
 */
export function useAgentActivities(agentId: string) {
  return useApiQuery<Activity[]>({
    queryKey: ["activities", agentId],
    url: `/api/agent/${agentId}/activities`,
    enabled: !!agentId,
  });
}

/**
 * Hook to approve an activity
 */
export function useApproveActivity() {
  const queryClient = useQueryClient();

  return useApiMutation<Activity, { activityId: string; agentId: string }>({
    mutationKey: ["approveActivity"],
    url: ({ activityId }) => `/api/activities/${activityId}/approve`,
    method: "POST",
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["activities", variables.agentId],
      });
    },
  });
}

/**
 * Hook to reject an activity
 */
export function useRejectActivity() {
  const queryClient = useQueryClient();

  return useApiMutation<Activity, { activityId: string; agentId: string }>({
    mutationKey: ["rejectActivity"],
    url: ({ activityId }) => `/api/activities/${activityId}/reject`,
    method: "POST",
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["activities", variables.agentId],
      });
    },
  });
}
