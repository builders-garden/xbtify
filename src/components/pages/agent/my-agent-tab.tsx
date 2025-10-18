"use client";

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

  // Parse the styleProfilePrompt JSON if it exists
  let styleProfile: {
    vocabulary?: {
      common_phrases?: string[];
      jargon?: string[];
    };
    keywords?: Record<string, string>;
    tone?: string;
  } | null = null;

  try {
    if (agent.styleProfilePrompt) {
      styleProfile = JSON.parse(agent.styleProfilePrompt);
    }
  } catch {
    // Invalid JSON, ignore
  }

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
          <h2 className="font-bold text-2xl text-white">
            {agent.displayName || agent.username}
          </h2>
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
                <SelectItem value="builder">👷 Builder</SelectItem>
                <SelectItem value="artist">🎨 Artist</SelectItem>
                <SelectItem value="business">💼 Business</SelectItem>
                <SelectItem value="degen">🎲 Degen</SelectItem>
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
                <SelectItem value="formal">🎩 Formal</SelectItem>
                <SelectItem value="enthusiastic">🔥 Enthusiastic</SelectItem>
                <SelectItem value="irreverent">😎 Irreverent</SelectItem>
                <SelectItem value="humorous">😂 Humorous</SelectItem>
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
                <SelectItem value="mastermind">🧠 Mastermind</SelectItem>
                <SelectItem value="buddy">🤝 Buddy</SelectItem>
                <SelectItem value="comic relief">🤡 Comic Relief</SelectItem>
                <SelectItem value="villain">😈 Villain</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Style Profile - Common Phrases */}
      {styleProfile?.vocabulary?.common_phrases &&
        styleProfile.vocabulary.common_phrases.length > 0 && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-purple-400/20 bg-gradient-to-br from-purple-500/5 via-purple-500/5 to-purple-600/5 p-4 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <h3 className="mb-3 font-bold text-lg text-white">
              Common Phrases 💬
            </h3>
            <div className="flex flex-wrap gap-2">
              {styleProfile.vocabulary.common_phrases
                .slice(0, 8)
                .map((phrase) => (
                  <span
                    className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-purple-200 text-sm"
                    key={phrase}
                  >
                    "{phrase}"
                  </span>
                ))}
            </div>
          </motion.div>
        )}

      {/* Style Profile - Jargon */}
      {styleProfile?.vocabulary?.jargon &&
        styleProfile.vocabulary.jargon.length > 0 && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-purple-400/20 bg-gradient-to-br from-purple-500/5 via-purple-500/5 to-purple-600/5 p-4 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <h3 className="mb-3 font-bold text-lg text-white">
              Vocabulary & Jargon 🗣️
            </h3>
            <div className="flex flex-wrap gap-2">
              {styleProfile.vocabulary.jargon.slice(0, 15).map((word) => (
                <span
                  className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-purple-200 text-sm"
                  key={word}
                >
                  {word}
                </span>
              ))}
            </div>
          </motion.div>
        )}

      {/* Style Profile - Keywords/Topics */}
      {styleProfile?.keywords &&
        Object.keys(styleProfile.keywords).length > 0 && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-purple-400/20 bg-gradient-to-br from-purple-500/5 via-purple-500/5 to-purple-600/5 p-4 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <h3 className="mb-3 font-bold text-lg text-white">
              Topics & Expertise 🎯
            </h3>
            <div className="space-y-2">
              {Object.entries(styleProfile.keywords)
                .slice(0, 5)
                .map(([key, description]) => (
                  <div
                    className="rounded-lg border border-purple-400/20 bg-purple-500/5 p-3"
                    key={key}
                  >
                    <h4 className="mb-1 font-semibold text-purple-300 text-sm capitalize">
                      {key.replace(/_/g, " ")}
                    </h4>
                    <p className="text-purple-200/70 text-xs">{description}</p>
                  </div>
                ))}
            </div>
          </motion.div>
        )}

      {/* Style Profile - Tone Description */}
      {styleProfile?.tone && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-purple-400/20 bg-gradient-to-br from-purple-500/5 via-purple-500/5 to-purple-600/5 p-4 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <h3 className="mb-2 font-bold text-lg text-white">
            Communication Style ✨
          </h3>
          <p className="text-purple-200/80 text-sm leading-relaxed">
            {styleProfile.tone}
          </p>
        </motion.div>
      )}
    </div>
  );
}
