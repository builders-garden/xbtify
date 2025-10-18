"use client";

import { ArrowLeft, MessageCircle, Share2 } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
import type { MarketplaceAgent } from "@/types/agent.type";
import {
  CommonPhrases,
  CommunicationStyle,
  Jargon,
  PersonalityTraits,
  parseStyleProfile,
  Topics,
} from "./shared-agent-components";

type AgentDetailViewProps = {
  agent: MarketplaceAgent;
  onBack: () => void;
};

export function AgentDetailView({ agent, onBack }: AgentDetailViewProps) {
  const styleProfile = parseStyleProfile(agent.styleProfilePrompt);

  return (
    <div className="flex flex-col gap-4 pb-28 text-white">
      {/* Back Button */}
      <Button
        className="w-fit cursor-pointer gap-2 border-purple-400/30 bg-purple-500/10 text-white hover:bg-purple-500/20 hover:text-white"
        onClick={onBack}
        variant="outline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Explore
      </Button>

      {/* Tab Header */}
      <p className="text-purple-200/80 text-sm">
        View agent details and personality
      </p>

      {/* Agent Header */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 rounded-xl border border-purple-400/20 bg-gradient-to-br from-purple-500/5 via-purple-500/5 to-purple-600/5 p-4 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <UserAvatar
          alt={agent.displayName}
          avatarUrl={agent.avatarUrl ?? null}
          size="xl"
        />
        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-bold text-white text-xl">
              {agent.displayName}
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

      {/* About */}
      {agent.bio && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-purple-400/20 bg-gradient-to-br from-purple-500/5 via-purple-500/5 to-purple-600/5 p-4 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h3 className="mb-2 font-bold text-lg text-white">About</h3>
          <p className="text-purple-200/80 text-sm leading-relaxed">
            {agent.bio}
          </p>
        </motion.div>
      )}

      {/* Personality Traits - Using shared component */}
      <PersonalityTraits
        delay={0.2}
        movieCharacter={agent.movieCharacter}
        personality={agent.personality}
        tone={agent.tone}
      />

      {/* Style Profile - Common Phrases */}
      {styleProfile?.vocabulary?.common_phrases && (
        <CommonPhrases
          delay={0.3}
          phrases={styleProfile.vocabulary.common_phrases}
        />
      )}

      {/* Style Profile - Jargon */}
      {styleProfile?.vocabulary?.jargon && (
        <Jargon delay={0.4} jargon={styleProfile.vocabulary.jargon} />
      )}

      {/* Style Profile - Keywords/Topics */}
      {styleProfile?.keywords && (
        <Topics delay={0.5} keywords={styleProfile.keywords} />
      )}

      {/* Style Profile - Tone Description */}
      {styleProfile?.tone && (
        <CommunicationStyle delay={0.6} style={styleProfile.tone} />
      )}

      {/* Floating Chat Button */}
      <motion.button
        animate={{ opacity: 1 }}
        className="fixed right-4 bottom-28 z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500"
        initial={{ opacity: 0 }}
        onClick={() => {
          // TODO: Implement chat functionality / open chat link
        }}
        transition={{ opacity: { duration: 0.2, delay: 0.3 } }}
        type="button"
        whileHover={{
          scale: 1.05,
        }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </motion.button>
    </div>
  );
}
