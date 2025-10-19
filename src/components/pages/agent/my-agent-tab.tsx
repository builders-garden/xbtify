"use client";

import { Share2 } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import type { Address } from "viem";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useUsdcBalance } from "@/hooks/use-usdc-balance";
import type { Agent } from "@/lib/database/db.schema";
import {
  CHARACTER_OPTIONS,
  PERSONALITY_OPTIONS,
  parseStyleProfile,
  StyleProfileAccordion,
  TONE_OPTIONS,
} from "./shared-agent-components";

type MyAgentTabProps = {
  agent: Agent;
  onUpdateAgent: (agent: Partial<Agent>) => void;
};

export function MyAgentTab({ agent, onUpdateAgent }: MyAgentTabProps) {
  // Fetch USDC balance
  const { balance, isLoading: isLoadingBalance } = useUsdcBalance({
    address: agent.address as Address | undefined,
    enabled: !!agent.address,
  });

  const styleProfile = parseStyleProfile(agent.styleProfilePrompt);

  const handlePersonalityChange = (value: string) => {
    onUpdateAgent({ personality: value || undefined });
  };

  const handleToneChange = (value: string) => {
    onUpdateAgent({ tone: value || undefined });
  };

  const handleMovieCharacterChange = (value: string) => {
    onUpdateAgent({ movieCharacter: value || undefined });
  };

  const formatUSDC = (value: string) => {
    const num = Number.parseFloat(value);
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="flex flex-col gap-4 pb-28 text-white">
      {/* Tab Header */}
      <div className="flex flex-col gap-2">
        <h2 className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text font-bold text-4xl text-transparent">
          My Agent
        </h2>
        <p className="text-purple-200/80 text-sm">
          Manage your AI agent's personality and settings
        </p>
      </div>

      {/* Agent Header */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 rounded-xl border border-purple-400/20 bg-gradient-to-br from-purple-500/5 via-purple-500/5 to-purple-600/5 p-4 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <UserAvatar
          alt={agent.displayName || agent.username || "Agent"}
          avatarUrl={agent.avatarUrl ?? null}
          size="xl"
        />
        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-bold text-white text-xl">
              {agent.displayName || agent.username}
            </h2>
            <motion.button
              className="cursor-pointer rounded-full p-1.5 text-purple-300 transition-colors hover:bg-purple-500/20 hover:text-white"
              onClick={() => {
                // TODO: Implement share functionality
              }}
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Share2 className="h-5 w-5" />
            </motion.button>
          </div>
          <p className="text-purple-200/60 text-sm">@{agent.username}</p>
          {agent.address && (
            <p className="mt-1 font-mono text-purple-200/40 text-xs">
              {agent.address.slice(0, 6)}...{agent.address.slice(-4)}
            </p>
          )}
        </div>
      </motion.div>

      {/* USDC Balance */}
      {agent.address && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-xl border border-purple-400/20 bg-gradient-to-br from-purple-500/5 via-purple-500/5 to-purple-600/5 p-4 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200/60 text-sm">Agent Balance</p>
              {isLoadingBalance ? (
                <Skeleton className="mt-1 h-9 w-48 bg-purple-500/20" />
              ) : (
                <p className="mt-1 bg-gradient-to-r from-purple-300 to-purple-400 bg-clip-text font-bold text-3xl text-transparent">
                  ${balance ? formatUSDC(balance.formatted) : "0.00"} USDC
                </p>
              )}
            </div>
            <div className="relative right-4 h-14 w-14 scale-[4] hue-rotate-[42deg]">
              <Image
                alt="Dollar"
                className="object-contain"
                fill
                src="/images/dollar.png"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Agent Configuration */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-purple-400/20 bg-gradient-to-br from-purple-500/5 via-purple-500/5 to-purple-600/5 p-4 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="mb-3">
          <h3 className="font-bold text-lg text-white">Agent Configuration</h3>
        </div>

        <div className="space-y-3">
          {/* Personality */}
          <div>
            <p className="mb-1.5 block text-purple-200/80 text-sm">
              Personality
            </p>
            <Select
              onValueChange={handlePersonalityChange}
              value={agent.personality || ""}
            >
              <SelectTrigger className="w-full border-purple-400/30 bg-purple-500/10 text-white focus:ring-purple-500/60">
                <SelectValue placeholder="Select personality..." />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PERSONALITY_OPTIONS).map(
                  ([value, { label, emoji }]) => (
                    <SelectItem key={value} value={value}>
                      {emoji} {label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Tone */}
          <div>
            <p className="mb-1.5 block text-purple-200/80 text-sm">Tone</p>
            <Select onValueChange={handleToneChange} value={agent.tone || ""}>
              <SelectTrigger className="w-full border-purple-400/30 bg-purple-500/10 text-white focus:ring-purple-500/60">
                <SelectValue placeholder="Select tone..." />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TONE_OPTIONS).map(
                  ([value, { label, emoji }]) => (
                    <SelectItem key={value} value={value}>
                      {emoji} {label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Movie Character */}
          <div>
            <p className="mb-1.5 block text-purple-200/80 text-sm">
              Character Type
            </p>
            <Select
              onValueChange={handleMovieCharacterChange}
              value={agent.movieCharacter || ""}
            >
              <SelectTrigger className="w-full border-purple-400/30 bg-purple-500/10 text-white focus:ring-purple-500/60">
                <SelectValue placeholder="Select character..." />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CHARACTER_OPTIONS).map(
                  ([value, { label, emoji }]) => (
                    <SelectItem key={value} value={value}>
                      {emoji} {label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Style Profile - Accordion */}
      {styleProfile && <StyleProfileAccordion styleProfile={styleProfile} />}
    </div>
  );
}
