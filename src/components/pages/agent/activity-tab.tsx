"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserAvatar } from "@/components/ui/user-avatar";
import {
  useAgentActivities,
  useApproveActivity,
  useRejectActivity,
} from "@/hooks/use-activities";
import type { Activity } from "@/types/agent.type";

type ActivityTabProps = {
  agentId: string;
};

export function ActivityTab({ agentId }: ActivityTabProps) {
  const [activeSubTab, setActiveSubTab] = useState("answers");
  const { data: activities = [], isLoading } = useAgentActivities(agentId);
  const approveActivity = useApproveActivity();
  const rejectActivity = useRejectActivity();

  // Fallback to mock data if API is not ready
  const mockActivities: Activity[] = [
    {
      id: "1",
      type: "answer",
      agentReply: "Just vibing with the new crypto trends! 🚀",
      originalMessage: "@agent what do you think about the market?",
      originalUser: {
        username: "cryptofan",
        fid: 12345,
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      status: "approved",
    },
    {
      id: "2",
      type: "review",
      agentReply: "Hmm, that's a spicy take! Let me think about it... 🤔",
      originalMessage: "@agent controversial opinion on ETH?",
      originalUser: {
        username: "ethmaxi",
        fid: 67890,
      },
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      status: "pending",
    },
  ];

  // Use API data if available, otherwise use mock data
  const displayActivities = activities.length > 0 ? activities : mockActivities;
  const answers = displayActivities.filter((a) => a.type === "answer");
  const reviews = displayActivities.filter((a) => a.type === "review");

  const formatTimestamp = (timestamp: Date) => {
    const date = timestamp;
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
    <div className="flex h-full w-full flex-col gap-6 text-white">
      <Tabs
        className="flex h-full w-full flex-col gap-4"
        onValueChange={setActiveSubTab}
        value={activeSubTab}
      >
        <TabsList className="grid w-full grid-cols-2 rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
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
        </TabsList>

        <div className="flex-1 overflow-y-auto">
          <TabsContent className="m-0" value="answers">
            {isLoading ? (
              <div className="w-full max-w-2xl space-y-4">
                <Skeleton className="h-32 w-full rounded-xl bg-purple-500/20" />
                <Skeleton className="h-32 w-full rounded-xl bg-purple-500/20" />
                <Skeleton className="h-32 w-full rounded-xl bg-purple-500/20" />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {answers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur">
                    <p className="text-white/60">No answers yet</p>
                    <p className="text-white/40 text-xs">
                      Your agent will automatically respond to mentions
                    </p>
                  </div>
                ) : (
                  answers.map((activity) => (
                    <ActivityCard
                      activity={activity}
                      agentId={agentId}
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
              <div className="flex flex-col gap-4">
                {reviews.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                    <p className="text-muted-foreground">No pending reviews</p>
                    <p className="text-muted-foreground text-sm">
                      Messages requiring your approval will appear here
                    </p>
                  </div>
                ) : (
                  reviews.map((activity) => (
                    <ActivityCard
                      activity={activity}
                      agentId={agentId}
                      approveActivity={approveActivity}
                      formatTimestamp={formatTimestamp}
                      key={activity.id}
                      rejectActivity={rejectActivity}
                      showActions
                    />
                  ))
                )}
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

type ActivityCardProps = {
  activity: Activity;
  agentId: string;
  formatTimestamp: (timestamp: Date) => string;
  showActions?: boolean;
  approveActivity: ReturnType<typeof useApproveActivity>;
  rejectActivity: ReturnType<typeof useRejectActivity>;
};

function ActivityCard({
  activity,
  agentId,
  formatTimestamp,
  showActions = false,
  approveActivity,
  rejectActivity,
}: ActivityCardProps) {
  const handleApprove = () => {
    approveActivity.mutate({ activityId: activity.id, agentId });
  };

  const handleReject = () => {
    rejectActivity.mutate({ activityId: activity.id, agentId });
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      {/* Author Info */}
      <div className="flex items-center gap-3">
        <UserAvatar
          alt={activity.originalUser.username}
          avatarUrl={null}
          size="sm"
        />
        <div className="flex flex-1 flex-col">
          <p className="font-medium text-sm text-white">
            @{activity.originalUser.username}
          </p>
          <p className="text-white/60 text-xs">
            FID: {activity.originalUser.fid}
          </p>
        </div>
        <span className="text-white/60 text-xs">
          {formatTimestamp(activity.timestamp)}
        </span>
      </div>

      {/* Original Message */}
      <div className="rounded-xl bg-white/5 p-3">
        <p className="text-sm text-white/80">{activity.originalMessage}</p>
      </div>

      {/* Agent Response */}
      <div className="rounded-xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 p-3">
        <p className="font-medium text-purple-300 text-xs">Your Agent</p>
        <p className="mt-1 text-sm text-white">{activity.agentReply}</p>
      </div>

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
