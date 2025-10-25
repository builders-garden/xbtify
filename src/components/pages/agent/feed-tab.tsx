"use client";

import { sdk } from "@farcaster/miniapp-sdk";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { UserAvatar } from "@/components/ui/user-avatar";
import {
  useAgentActivities,
  useApproveActivity,
  useRejectActivity,
} from "@/hooks/use-activities";
import type { AgentCastsWithParentUserMetadata } from "@/types/agent.type";

type FeedTabProps = {
  agentFid: number;
};

export function FeedTab({ agentFid: agentId }: FeedTabProps) {
  const [activeSubTab, setActiveSubTab] = useState("answers");
  const { data: activitiesDb, isLoading } = useAgentActivities(agentId);
  const approveActivity = useApproveActivity();
  const rejectActivity = useRejectActivity();

  console.log({
    activitiesDb,
  });

  const activities = activitiesDb?.activities;

  const formatTimestamp = (timestamp: Date | string | null) => {
    const date = timestamp ? new Date(timestamp) : new Date();
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    }
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    }
    return `${diffDays}d ago`;
  };

  return (
    <div className="flex h-full w-full flex-col gap-4 text-white">
      {/* Tab Header */}
      <div className="flex flex-col gap-2">
        <h2 className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text font-bold font-jersey text-5xl text-transparent">
          Feed
        </h2>
        <p className="text-purple-200/80 text-sm">
          Your agent's conversations and interactions
        </p>
      </div>

      <Tabs
        className="flex h-full w-full flex-col gap-4"
        onValueChange={setActiveSubTab}
        value={activeSubTab}
      >
        {/* <TabsList className="grid w-full grid-cols-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
          <TabsTrigger
            className="rounded-xl text-white/60 transition hover:cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
            value="answers"
          >
            Answers
          </TabsTrigger>
          <TabsTrigger
            className="rounded-xl text-white/60 transition hover:cursor-pointer data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
            value="review"
          >
            Review
          </TabsTrigger>
        </TabsList> */}

        <div className="flex-1 overflow-y-auto">
          <TabsContent className="m-0" value="answers">
            {isLoading ? (
              <div className="w-full max-w-2xl space-y-4">
                <Skeleton className="h-32 w-full rounded-xl bg-purple-500/20" />
                <Skeleton className="h-32 w-full rounded-xl bg-purple-500/20" />
                <Skeleton className="h-32 w-full rounded-xl bg-purple-500/20" />
              </div>
            ) : (
              <div className="flex flex-col gap-4 pb-24">
                {activities?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur">
                    <p className="text-white/60">No answers yet</p>
                    <p className="text-white/40 text-xs">
                      Your agent will automatically respond to mentions
                    </p>
                  </div>
                ) : (
                  activities?.map((activity) => (
                    <ActivityCard
                      activity={activity}
                      agentFid={agentId}
                      approveActivity={approveActivity}
                      formatTimestamp={formatTimestamp}
                      key={activity.id}
                      rejectActivity={rejectActivity}
                    />
                  ))
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent className="m-0" value="review">
            {isLoading ? (
              <div className="w-full max-w-2xl space-y-4">
                <Skeleton className="h-32 w-full rounded-xl bg-purple-500/20" />
                <Skeleton className="h-32 w-full rounded-xl bg-purple-500/20" />
                <Skeleton className="h-32 w-full rounded-xl bg-purple-500/20" />
              </div>
            ) : (
              // <div className="flex flex-col gap-4">
              //   {reviews.length === 0 ? (
              //     <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              //       <p className="text-muted-foreground">No pending reviews</p>
              //       <p className="text-muted-foreground text-sm">
              //         Messages requiring your approval will appear here
              //       </p>
              //     </div>
              //   ) : (
              //     reviews.map((activity) => (
              //       <ActivityCard
              //         activity={activity}
              //         agentFid={agentId}
              //         approveActivity={approveActivity}
              //         formatTimestamp={formatTimestamp}
              //         key={activity.id}
              //         rejectActivity={rejectActivity}
              //         showActions
              //       />
              //     ))
              //   )}
              // </div>
              <>boh</>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

type ActivityCardProps = {
  activity: AgentCastsWithParentUserMetadata;
  agentFid: number;
  formatTimestamp: (timestamp: Date | string | null) => string;
  showActions?: boolean;
  approveActivity: ReturnType<typeof useApproveActivity>;
  rejectActivity: ReturnType<typeof useRejectActivity>;
};

function ActivityCard({
  activity,
  agentFid,
  formatTimestamp,
  showActions = false,
  approveActivity,
  rejectActivity,
}: ActivityCardProps) {
  const handleApprove = () => {
    approveActivity.mutate({ activityId: activity.id, agentFid });
  };

  const handleReject = () => {
    rejectActivity.mutate({ activityId: activity.id, agentFid });
  };

  const handleViewProfile = async () => {
    if (activity.parentCastAuthorFid) {
      await sdk.actions.viewProfile({
        fid: activity.parentCastAuthorFid,
      });
    }
  };

  const handleViewParentCast = async () => {
    if (activity.parentCastHash) {
      await sdk.actions.viewCast({
        hash: activity.parentCastHash,
      });
    }
  };

  const handleViewAgentCast = async () => {
    if (activity.castHash) {
      await sdk.actions.viewCast({
        hash: activity.castHash,
      });
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      {/* Author Info */}
      <button
        className="flex cursor-pointer items-center gap-3 text-left transition-opacity hover:opacity-80"
        onClick={handleViewProfile}
        type="button"
      >
        <UserAvatar
          alt={
            activity.parentUserMetadata?.username ||
            `user-${activity.parentCastAuthorFid}` ||
            "Unknown"
          }
          avatarUrl={activity.parentUserMetadata?.avatarUrl || null}
          size="sm"
        />
        <div className="flex flex-1 flex-col">
          <p className="font-medium text-sm text-white">
            @
            {activity.parentUserMetadata?.username ||
              `user-${activity.parentCastAuthorFid}` ||
              "unknown"}
          </p>
          <p className="text-white/60 text-xs">
            FID: {activity.parentCastAuthorFid || "N/A"}
          </p>
        </div>
        <span className="text-white/60 text-xs">
          {formatTimestamp(activity.createdAt || new Date())}
        </span>
      </button>

      {/* Original Message */}
      <button
        className="cursor-pointer rounded-xl bg-white/5 p-3 text-left transition-colors hover:bg-white/10"
        onClick={handleViewParentCast}
        type="button"
      >
        <p className="text-sm text-white/80">
          {activity.parentCastText || "No parent message"}
        </p>
      </button>

      {/* Agent Response */}
      <button
        className="cursor-pointer rounded-xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 p-3 text-left transition-colors hover:from-purple-500/30 hover:to-indigo-500/30"
        onClick={handleViewAgentCast}
        type="button"
      >
        <p className="font-medium text-purple-300 text-xs">Your Agent</p>
        <p className="mt-1 text-sm text-white">{activity.castText}</p>
      </button>

      {/* Action Buttons (for Review) */}
      {showActions && (
        <div className="flex gap-2">
          <Button
            className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg transition hover:from-purple-400 hover:to-indigo-400"
            onClick={handleApprove}
            size="sm"
          >
            Approve
          </Button>
          <Button
            className="flex-1 border-white/30 bg-white/10 text-white hover:bg-white/20"
            onClick={handleReject}
            size="sm"
            variant="outline"
          >
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}
