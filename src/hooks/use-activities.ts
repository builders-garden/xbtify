"use client";

import { useQueryClient } from "@tanstack/react-query";
import type {
  Activity,
  AgentCastsWithParentUserMetadata,
} from "@/types/agent.type";
import { useApiMutation } from "./use-api-mutation";
import { useApiQuery } from "./use-api-query";

/**
 * Hook to fetch activities for an agent
 */
export function useAgentActivities(agentFid: number) {
  return useApiQuery<{
    status: string;
    activities: AgentCastsWithParentUserMetadata[];
  }>({
    queryKey: ["activities", agentFid],
    url: `/api/agent/${agentFid}/activities`,
    enabled: !!agentFid,
  });
}

/**
 * Hook to approve an activity
 */
export function useApproveActivity() {
  const queryClient = useQueryClient();

  return useApiMutation<Activity, { activityId: string; agentFid: number }>({
    mutationKey: ["approveActivity"],
    url: ({ activityId }) => `/api/activities/${activityId}/approve`,
    method: "POST",
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["activities", variables.agentFid],
      });
    },
  });
}

/**
 * Hook to reject an activity
 */
export function useRejectActivity() {
  const queryClient = useQueryClient();

  return useApiMutation<Activity, { activityId: string; agentFid: number }>({
    mutationKey: ["rejectActivity"],
    url: ({ activityId }) => `/api/activities/${activityId}/reject`,
    method: "POST",
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["activities", variables.agentFid],
      });
    },
  });
}
