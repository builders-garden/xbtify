"use client";

import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useMarketplaceAgents } from "@/hooks/use-marketplace";
import type { MarketplaceAgent } from "@/types/agent.type";

export function MarketplaceTab() {
  const { data: agents = [], isLoading } = useMarketplaceAgents();

  // Fallback to mock data if API is not ready
  const mockAgents: MarketplaceAgent[] = [
    {
      id: "1",
      username: "vitalik",
      displayName: "Vitalik",
      bio: "Ethereum co-founder vibes",
      avatarUrl: "https://i.pravatar.cc/150?u=vitalik",
      messageCount: 1234,
      followerCount: 89000,
      externalUrl: "https://warpcast.com/vitalik",
    },
    {
      id: "2",
      username: "dwr",
      displayName: "Dan Romero",
      bio: "Farcaster founder energy",
      avatarUrl: "https://i.pravatar.cc/150?u=dwr",
      messageCount: 5678,
      followerCount: 125000,
      externalUrl: "https://warpcast.com/dwr",
    },
    {
      id: "3",
      username: "jessepollak",
      displayName: "Jesse Pollak",
      bio: "Base builder mindset",
      avatarUrl: "https://i.pravatar.cc/150?u=jessepollak",
      messageCount: 3456,
      followerCount: 67000,
      externalUrl: "https://warpcast.com/jessepollak",
    },
    {
      id: "4",
      username: "cryptowhale",
      displayName: "Crypto Whale",
      bio: "Diamond hands only 💎",
      avatarUrl: "https://i.pravatar.cc/150?u=cryptowhale",
      messageCount: 890,
      followerCount: 45000,
      externalUrl: "https://warpcast.com/cryptowhale",
    },
  ];

  // Use API data if available, otherwise use mock data
  const displayAgents = agents.length > 0 ? agents : mockAgents;

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const handleStartVibing = (agent: MarketplaceAgent) => {
    // Open external link in new tab
    window.open(agent.externalUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h2 className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text font-bold text-2xl text-transparent">
          Marketplace
        </h2>
        <p className="text-purple-200/80 text-sm">
          Discover and vibe with other agents
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center rounded-xl border border-purple-400/20 bg-gradient-to-br from-purple-500/5 via-indigo-500/5 to-purple-600/5 py-12 backdrop-blur-sm">
          <p className="text-purple-200/60">Loading agents...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {displayAgents.map((agent) => (
              <MarketplaceAgentCard
                agent={agent}
                formatNumber={formatNumber}
                key={agent.id}
                onStartVibing={handleStartVibing}
              />
            ))}
          </div>

          {displayAgents.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-purple-400/20 bg-gradient-to-br from-purple-500/5 via-indigo-500/5 to-purple-600/5 py-12 text-center backdrop-blur-sm">
              <p className="text-purple-200/60">No agents available</p>
              <p className="text-purple-200/40 text-sm">
                Check back later for more agents to vibe with
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

type MarketplaceAgentCardProps = {
  agent: MarketplaceAgent;
  formatNumber: (num: number) => string;
  onStartVibing: (agent: MarketplaceAgent) => void;
};

function MarketplaceAgentCard({
  agent,
  formatNumber,
  onStartVibing,
}: MarketplaceAgentCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-purple-400/20 bg-gradient-to-br from-purple-500/5 via-indigo-500/5 to-purple-600/5 p-4 backdrop-blur-sm transition-all hover:border-purple-400/40">
      {/* Agent Header */}
      <div className="flex items-center gap-3">
        <UserAvatar
          alt={agent.displayName}
          avatarUrl={agent.avatarUrl ?? null}
          size="md"
        />
        <div className="flex flex-1 flex-col">
          <p className="font-medium text-white">{agent.displayName}</p>
          <p className="text-purple-200/60 text-xs">@{agent.username}</p>
        </div>
      </div>

      {/* Agent Bio */}
      <p className="line-clamp-2 text-purple-200/80 text-sm">{agent.bio}</p>

      {/* Agent Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col">
          <p className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text font-bold text-lg text-transparent">
            {formatNumber(agent.messageCount)}
          </p>
          <p className="text-purple-200/60 text-xs">Messages</p>
        </div>
        <div className="flex flex-col">
          <p className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text font-bold text-lg text-transparent">
            {formatNumber(agent.followerCount)}
          </p>
          <p className="text-purple-200/60 text-xs">Followers</p>
        </div>
      </div>

      {/* Action Button */}
      <Button
        className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 font-semibold text-white transition-all hover:from-purple-600 hover:to-indigo-600"
        onClick={() => onStartVibing(agent)}
      >
        Start Vibing
      </Button>
    </div>
  );
}
