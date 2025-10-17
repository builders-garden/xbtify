import {
  type UseApiMutationOptions,
  useApiMutation,
} from "@/hooks/use-api-mutation";
import { useApiQuery } from "@/hooks/use-api-query";
import type { User } from "@/types/user.type";

// Auth queries
export function useAuthCheck(enabled = true) {
  const { data, isPending, isLoading, isFetched, refetch, error } =
    useApiQuery<{
      user?: User;
      status: "ok" | "nok";
      error?: string;
    }>({
      queryKey: ["auth-check"],
      url: "/api/auth/check",
      enabled,
      retry: false,
      refetchOnWindowFocus: false,
    });

  return {
    user: data?.user,
    isAuthenticated: data?.status === "ok",
    error: error || (data?.error ? new Error(data.error) : null),
    isLoading,
    isPending,
    isFetched,
    refetch,
  };
}

// Auth mutations
export function useFarcasterSignIn(
  options?: Partial<
    UseApiMutationOptions<
      { success: boolean; error?: string; user?: User },
      { fid: number; referrerFid?: number; token: string }
    >
  >
) {
  return useApiMutation<
    { success: boolean; error?: string; user?: User },
    { fid: number; referrerFid?: number; token: string }
  >({
    url: "/api/auth/sign-in/farcaster",
    method: "POST",
    body: (variables) => variables,
    ...options,
  });
}

export function useWalletSignIn(
  options?: Partial<
    UseApiMutationOptions<
      { success: boolean; error?: string; user?: User },
      { address: string; message: string; signature: string }
    >
  >
) {
  return useApiMutation<
    { success: boolean; error?: string; user?: User },
    { address: string; message: string; signature: string }
  >({
    url: "/api/auth/sign-in/wallet",
    method: "POST",
    body: (variables) => variables,
    ...options,
  });
}

export function useLogout(
  options?: Partial<UseApiMutationOptions<{ success: boolean }, object>>
) {
  return useApiMutation<{ success: boolean }, object>({
    url: "/api/auth/logout",
    method: "POST",
    body: () => ({}),
    ...options,
  });
}
