"use client";

// components
import { CircleUserRoundIcon, Loader2Icon, LogInIcon } from "lucide-react";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
// hooks
import { useApp } from "@/contexts/app-context";
import { useAuth } from "@/contexts/auth-context";
import { useFarcaster } from "@/contexts/farcaster-context";
import { PageContent } from "@/types/enums";
// other
import { cn, formatAvatarSrc, getInitials } from "@/utils";

export const UserProfile = () => {
  const { context, isInMiniApp } = useFarcaster();
  const { setActiveProfile, handlePageChange, pageContent } = useApp();
  const { user, isSignedIn, isLoading: isSigningIn } = useAuth();
  const { isConnected } = useAccount();

  const isDisabled =
    !isInMiniApp && (isSigningIn || (isConnected && isSignedIn));

  const isActivePage = pageContent === PageContent.PROFILE;

  const pfpUrl =
    isInMiniApp && context && context.user.pfpUrl
      ? formatAvatarSrc(context.user.pfpUrl)
      : user?.avatarUrl
        ? formatAvatarSrc(user.avatarUrl)
        : null;

  const handleOpenProfile = () => {
    if (user) {
      setActiveProfile(user);
      handlePageChange(PageContent.PROFILE);
    }
  };
  return (
    <div className="flex flex-row items-center gap-2 tracking-tight">
      {isInMiniApp ? (
        <Button
          className={
            "h-12 w-12 rounded-xl bg-transparent p-0 transition-all hover:bg-transparent"
          }
          disabled={isDisabled}
          onClick={handleOpenProfile}
          size="icon"
          variant="ghost"
        >
          {isSignedIn ? (
            pfpUrl ? (
              <UserAvatar
                avatarUrl={pfpUrl}
                className={cn(
                  "h-8 w-8 border-2 transition-all duration-200 ease-in-out hover:border-indigo-600",
                  isActivePage ? "border-indigo-500" : "border-transparent"
                )}
                size="sm"
              />
            ) : (
              <div
                className={cn(
                  "h-7 w-7 rounded-full border-2 text-muted-foreground text-sm hover:border-indigo-600",
                  isActivePage ? "border-indigo-500" : "border-transparent"
                )}
              >
                {user?.username ? getInitials(user.username) : ""}
              </div>
            )
          ) : isSigningIn ? (
            <div
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full border-2 hover:border-indigo-600",
                isActivePage ? "border-indigo-500" : "border-transparent"
              )}
            >
              <Loader2Icon className="h-5 w-5 animate-spin" />
            </div>
          ) : isConnected ? (
            <CircleUserRoundIcon className="h-5 w-5" />
          ) : (
            <LogInIcon className="h-5 w-5" />
          )}
        </Button>
      ) : null}
    </div>
  );
};
