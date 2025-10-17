export type Agent = {
  id: string;
  username: string;
  name: string; // Display name
  bio: string;
  personality: string;
  chaosLevel: number; // 0-100
  isLive: boolean;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  settings: {
    autoRespond: boolean;
    dmEnabled: boolean;
  };
  stats: {
    totalReplies: number;
    pendingReview: number;
    vibeScore: number;
  };
};

export type Activity = {
  id: string;
  type: "answer" | "review";
  status: "pending" | "approved" | "rejected";
  originalUser: {
    username: string;
    fid: number;
  };
  originalMessage: string;
  agentReply: string;
  timestamp: Date;
};

export type MarketplaceAgent = {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl?: string;
  messageCount: number;
  followerCount: number;
  externalUrl: string; // Warpcast or external link
};

export type AgentCreationProgress = {
  stage: "initializing" | "analyzing" | "training" | "complete";
  progress: number; // 0-100
  message: string;
};
