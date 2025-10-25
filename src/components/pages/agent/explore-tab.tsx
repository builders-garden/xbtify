"use client";

import { sdk } from "@farcaster/miniapp-sdk";
import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useMarketplaceAgents } from "@/hooks/use-marketplace";
import type { MarketplaceAgent } from "@/types/agent.type";
import { AgentDetailView } from "./agent-detail-view";

export function ExploreTab() {
  const { data: agents = [], isLoading } = useMarketplaceAgents();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<MarketplaceAgent | null>(
    null
  );

  const handleViewAgent = (agent: MarketplaceAgent) => {
    setSelectedAgent(agent);
  };

  const handleBackToExplore = () => {
    setSelectedAgent(null);
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
    <AnimatePresence mode="wait">
      {selectedAgent ? (
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          initial={{ opacity: 0, x: -20 }}
          key="agent-detail"
          transition={{ duration: 0.3 }}
        >
          <AgentDetailView agent={selectedAgent} onBack={handleBackToExplore} />
        </motion.div>
      ) : (
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="relative flex flex-col gap-4 pb-20"
          exit={{ opacity: 0, x: -20 }}
          initial={{ opacity: 0, x: 20 }}
          key="explore-list"
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col gap-2">
            <h2 className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text font-bold font-jersey text-5xl text-transparent">
              Explore
            </h2>
            <p className="text-purple-200/80 text-sm">
              Discover and vibe with other agents
            </p>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center">
              <div className="w-full max-w-sm space-y-4">
                <Skeleton className="h-24 w-full rounded-xl bg-purple-500/20" />
                <Skeleton className="h-24 w-full rounded-xl bg-purple-500/20" />
                <Skeleton className="h-24 w-full rounded-xl bg-purple-500/20" />
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 pb-4 sm:grid-cols-2">
                {filteredAgents.map((agent) => (
                  <MarketplaceAgentCard
                    agent={agent}
                    key={agent.id}
                    onStartVibing={handleViewAgent}
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
        </motion.div>
      )}

      {/* Floating Search Button/Bar - Render outside AnimatePresence to prevent glitch */}
      {!selectedAgent && (
        <motion.div
          animate={{
            opacity: 1,
            width: isSearchOpen ? "calc(100vw - 2rem)" : "56px",
            maxWidth: isSearchOpen ? "28rem" : "56px",
          }}
          className="fixed right-4 bottom-28 z-40"
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
      )}
    </AnimatePresence>
  );
}

type MarketplaceAgentCardProps = {
  agent: MarketplaceAgent;
  onStartVibing: (agent: MarketplaceAgent) => void;
};

function MarketplaceAgentCard({
  agent,
  onStartVibing,
}: MarketplaceAgentCardProps) {
  const handleViewProfile = async () => {
    if (agent.fid) {
      await sdk.actions.viewProfile({
        fid: agent.fid,
      });
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-purple-400/20 bg-gradient-to-br from-purple-500/5 via-indigo-500/5 to-purple-600/5 p-4 backdrop-blur-sm transition-all hover:border-purple-400/40">
      {/* Agent Header */}
      <button
        className="flex cursor-pointer items-center gap-3 text-left transition-opacity hover:opacity-80"
        onClick={handleViewProfile}
        type="button"
      >
        <UserAvatar
          alt={agent.displayName}
          avatarUrl={agent.avatarUrl ?? null}
          size="md"
        />
        <div className="flex flex-1 flex-col">
          <p className="font-medium text-white">{agent.displayName}</p>
          <p className="text-purple-200/60 text-xs">@{agent.username}</p>
        </div>
      </button>

      {/* Agent Bio */}
      <p className="line-clamp-2 text-purple-200/80 text-sm">{agent.bio}</p>

      {/* Action Button */}
      <Button
        className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 font-semibold text-white transition-all hover:cursor-pointer hover:from-purple-600 hover:to-indigo-600"
        onClick={() => onStartVibing(agent)}
      >
        View Agent
      </Button>
    </div>
  );
}
