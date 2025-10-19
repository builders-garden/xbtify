import { useQueryClient } from "@tanstack/react-query";
import type { Agent } from "@/lib/database/db.schema";
import { useApiMutation } from "./use-api-mutation";

type UpdateAgentProfileData = {
  bio?: string;
  avatarUrl?: string;
  displayName?: string;
  username?: string;
};

/**
 * Hook to update agent profile (bio, pfp, display_name, username)
 * This updates both the database and Neynar
 */
export function useUpdateAgentProfile() {
  const queryClient = useQueryClient();

  const mutation = useApiMutation<
    { agent: Agent; message: string },
    UpdateAgentProfileData
  >({
    url: "/api/agent/profile",
    method: "PATCH",
    body: (variables) => variables,
    onSuccess: () => {
      // Invalidate agent query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["agent"] });
    },
  });

  return {
    updateProfile: mutation.mutate,
    updateProfileAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,
  };
}
