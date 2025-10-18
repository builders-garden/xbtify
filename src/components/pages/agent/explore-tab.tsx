"use client";

import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useMarketplaceAgents } from "@/hooks/use-marketplace";
import type { MarketplaceAgent } from "@/types/agent.type";

export function ExploreTab() {
  const { data: agents = [], isLoading } = useMarketplaceAgents();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filter agents based on search query
  const filteredAgents = agents.filter((agent) => {
    if (!searchQuery) {
      return true;
    }
    const query = searchQuery.toLowerCase();
    return (
      agent.username.toLowerCase().includes(query) ||
      agent.displayName.toLowerCase().includes(query) ||
      agent.bio.toLowerCase().includes(query)
    );
  });

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  return (
    <div className="relative flex flex-col gap-4 pb-20">
      <div className="flex flex-col gap-2">
        <h2 className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text font-bold text-2xl text-transparent">
          Explore
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
          <div className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-2">
            {filteredAgents.map((agent) => (
              <MarketplaceAgentCard
                agent={agent}
                formatNumber={formatNumber}
                key={agent.id}
                onStartVibing={handleStartVibing}
              />
            ))}
          </div>

          {filteredAgents.length === 0 && agents.length > 0 && (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-purple-400/20 bg-gradient-to-br from-purple-500/5 via-indigo-500/5 to-purple-600/5 py-12 text-center backdrop-blur-sm">
              <p className="text-purple-200/60">No agents found</p>
              <p className="text-purple-200/40 text-sm">
                Try a different search term
              </p>
            </div>
          )}

          {agents.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-purple-400/20 bg-gradient-to-br from-purple-500/5 via-indigo-500/5 to-purple-600/5 py-12 text-center backdrop-blur-sm">
              <p className="text-purple-200/60">No agents available</p>
              <p className="text-purple-200/40 text-sm">
                Check back later for more agents to vibe with
              </p>
            </div>
          )}
        </>
      )}

      {/* Floating Search Button/Bar */}
      <motion.div
        animate={{
          opacity: 1,
          width: isSearchOpen ? "calc(100vw - 2rem)" : "56px",
          maxWidth: isSearchOpen ? "28rem" : "56px",
        }}
        className="fixed right-4 bottom-24 z-40"
        initial={{ opacity: 0, width: "56px", maxWidth: "56px" }}
        transition={{
          opacity: { duration: 0.2, delay: 0.3 },
          width: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
          maxWidth: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
        }}
      >
        <div className="relative h-14 w-full overflow-hidden rounded-full border border-purple-400/30 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-xl">
          <AnimatePresence initial={false} mode="sync">
            {isSearchOpen ? (
              <motion.div
                animate={{ opacity: 1 }}
                className="flex h-full w-full items-center gap-2 px-4"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key="search-content"
                transition={{ duration: 0.15 }}
              >
                <Search className="h-5 w-5 flex-shrink-0 text-purple-300" />
                <input
                  autoFocus
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-purple-300/50 focus:outline-none"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search agents..."
                  type="text"
                  value={searchQuery}
                />
                <motion.button
                  className="flex-shrink-0 cursor-pointer text-purple-300 hover:text-white"
                  onClick={handleClearSearch}
                  type="button"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-5 w-5" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.button
                animate={{ opacity: 1 }}
                className="flex h-full w-full cursor-pointer items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg shadow-purple-500/50"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                key="search-button"
                onClick={() => setIsSearchOpen(true)}
                transition={{ duration: 0.15 }}
                type="button"
                whileHover={{
                  scale: 1.05,
                  boxShadow:
                    "0 20px 25px -5px rgb(168 85 247 / 0.6), 0 8px 10px -6px rgb(168 85 247 / 0.6)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="h-6 w-6 text-white" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
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
        <div className="flex flex-col items-end">
          <p className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text font-bold text-lg text-transparent">
            {formatNumber(agent.followerCount)}
          </p>
          <p className="text-purple-200/60 text-xs">Followers</p>
        </div>
      </div>

      {/* Agent Bio */}
      <p className="line-clamp-2 text-purple-200/80 text-sm">{agent.bio}</p>

      {/* Action Button */}
      <Button
        className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 font-semibold text-white transition-all hover:cursor-pointer hover:from-purple-600 hover:to-indigo-600"
        onClick={() => onStartVibing(agent)}
      >
        Start Vibing
      </Button>
    </div>
  );
}
