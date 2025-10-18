"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

type MainFlowProps = {
  onCreateAgent: () => void;
  onViewExplore: () => void;
};

type Message = {
  id: number;
  username: string;
  text: string;
  isAgent: boolean;
  pfpUrl?: string;
};

const MOCK_MESSAGES = [
  {
    username: "thedude",
    text: "Hey @{username}, thoughts on the latest Farcaster updates?",
    pfpUrl: "/images/thedude.avif",
  },
  {
    isAgent: true,
    text: "The protocol improvements are solid. Channels are getting way more engaging.",
  },
  {
    username: "thedude",
    text: "Which channels are you active in?",
    pfpUrl: "/images/thedude.avif",
  },
  {
    isAgent: true,
    text: "Mostly builders and base. The conversations there are always worth following.",
  },
];

function TypingText({
  text,
  onComplete,
}: {
  text: string;
  onComplete: () => void;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 30); // Typing speed
      return () => clearTimeout(timeout);
    }

    if (currentIndex === text.length && onComplete) {
      const timeout = setTimeout(onComplete, 800); // Wait before next message
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, onComplete]);

  return <span>{displayedText}</span>;
}

export function MainFlow({ onCreateAgent, onViewExplore }: MainFlowProps) {
  const { user } = useAuth();
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Get agent username from authenticated user - memoize to prevent changes
  const agentUsername = user?.farcasterUsername
    ? `${user.farcasterUsername}XBT`
    : "casoXBT";
  const username = user?.farcasterUsername ?? "caso";
  const agentPfpUrl = user?.farcasterAvatarUrl;

  // Initialize first message only once
  useEffect(() => {
    if (!hasInitialized && currentMessageIndex === 0) {
      const mockMsg = MOCK_MESSAGES[0];
      const message: Message = {
        id: 0,
        username: mockMsg.username ?? "user",
        text: mockMsg.text.replace("{username}", username),
        isAgent: false,
        pfpUrl: mockMsg.pfpUrl,
      };
      setVisibleMessages([message]);
      setHasInitialized(true);
    }
  }, [hasInitialized, username, currentMessageIndex]);

  const handleTypingComplete = () => {
    const nextIndex = currentMessageIndex + 1;

    if (nextIndex < MOCK_MESSAGES.length) {
      const mockMsg = MOCK_MESSAGES[nextIndex];
      const message: Message = {
        id: nextIndex,
        username: mockMsg.isAgent
          ? agentUsername
          : (mockMsg.username ?? "user"),
        text: mockMsg.isAgent
          ? mockMsg.text
          : mockMsg.text.replace("{username}", username),
        isAgent: !!mockMsg.isAgent,
        pfpUrl: mockMsg.isAgent ? (agentPfpUrl ?? undefined) : mockMsg.pfpUrl,
      };

      setVisibleMessages((prev) => [...prev, message]);
      setCurrentMessageIndex(nextIndex);
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden">
      {/* Top Section - Header and Messages */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-start px-6 pt-8 pb-4">
        <div className="w-full max-w-2xl space-y-6">
          {/* Header */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              animate={{ opacity: 1 }}
              className="mb-3 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text font-bold text-3xl text-transparent"
              initial={{ opacity: 0 }}
            >
              Your AI twin, online 24/7
            </motion.h1>
            <p className="text-base text-indigo-300/80">
              Scale yourself. Answers mentions and replies in DMs automatically.
            </p>
          </motion.div>

          {/* Messages */}
          <motion.div
            animate={{ opacity: 1 }}
            className="w-full space-y-6"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AnimatePresence>
              {visibleMessages.map((message, index) => (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.isAgent ? "flex-row-reverse" : "flex-row"}`}
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0, y: 10 }}
                  key={message.id}
                  transition={{ duration: 0.3 }}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div
                      className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 ${
                        message.isAgent
                          ? "border-purple-500 bg-gradient-to-br from-purple-500 to-indigo-600"
                          : "border-white/20 bg-white/10"
                      }`}
                    >
                      {message.pfpUrl ? (
                        <Image
                          alt={message.username}
                          className={message.isAgent ? "invert" : ""}
                          height={40}
                          src={message.pfpUrl}
                          width={40}
                        />
                      ) : (
                        <span className="text-lg">
                          {message.isAgent ? "🤖" : "👤"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Message bubble */}
                  <div
                    className={`max-w-[80%] space-y-1 ${message.isAgent ? "items-end" : "items-start"} flex flex-col`}
                  >
                    <span
                      className={`font-medium text-xs ${
                        message.isAgent ? "text-purple-300" : "text-indigo-300"
                      }`}
                    >
                      @{message.username}
                    </span>
                    <div
                      className={`rounded-2xl p-2 py-1 ${
                        message.isAgent
                          ? "border border-purple-500/30 bg-gradient-to-br from-purple-500/20 to-indigo-600/20"
                          : "border border-white/20 bg-white/10"
                      }`}
                    >
                      <p className="text-sm text-white">
                        {index === visibleMessages.length - 1 ? (
                          <TypingText
                            onComplete={handleTypingComplete}
                            text={message.text}
                          />
                        ) : (
                          message.text
                        )}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Bottom Section - CTAs and Footer (Fixed) */}
      <div className="relative z-10 w-full px-6 pb-8">
        <div className="mx-auto w-full max-w-2xl space-y-4">
          {/* CTAs */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex w-full flex-col gap-3"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              className="h-12 w-full rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 font-semibold text-base text-white shadow-lg transition-transform hover:scale-105 hover:cursor-pointer active:scale-95"
              onClick={onCreateAgent}
            >
              Create your Twin Now 🚀
            </Button>

            <Button
              className="h-11 w-full rounded-2xl border-2 border-white/20 bg-white/5 font-medium text-sm text-white backdrop-blur-sm transition-all hover:cursor-pointer hover:border-white/40 hover:bg-white/10 hover:text-white"
              onClick={onViewExplore}
              variant="outline"
            >
              Explore Other Agents 👀
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
