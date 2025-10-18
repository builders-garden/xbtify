"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type { AgentCreationProgress } from "@/types/agent.type";

const PROGRESS_MESSAGES: AgentCreationProgress[] = [
  {
    stage: "initializing" as const,
    progress: 0,
    message: "Initializing chaos bot...",
  },
  {
    stage: "analyzing" as const,
    progress: 30,
    message: "Analyzing your Farcaster vibe 🔮",
  },
  {
    stage: "training" as const,
    progress: 52,
    message: "Learning your chaos style 💥",
  },
  {
    stage: "training" as const,
    progress: 75,
    message: "Training AI personality...",
  },
  {
    stage: "complete" as const,
    progress: 100,
    message: "Your chaos twin is ready! 🚀",
  },
];

type LoadingScreenProps = {
  onComplete?: () => void;
};

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState<AgentCreationProgress>(
    PROGRESS_MESSAGES[0]
  );
  const [progressIndex, setProgressIndex] = useState(0);

  useEffect(() => {
    if (progressIndex >= PROGRESS_MESSAGES.length - 1) {
      if (onComplete) {
        setTimeout(onComplete, 1000);
      }
      return;
    }

    const timer = setTimeout(
      () => {
        setProgressIndex((prev) => prev + 1);
        setProgress(PROGRESS_MESSAGES[progressIndex + 1]);
      },
      2000 + Math.random() * 1000
    ); // Random delay between 2-3s

    return () => clearTimeout(timer);
  }, [progressIndex, onComplete]);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden p-6">
      {/* Floating background elements */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          rotate: [0, 15, 0],
        }}
        className="absolute top-20 left-10 text-6xl opacity-10"
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        🤖
      </motion.div>
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -10, 0],
        }}
        className="absolute top-1/4 right-20 text-5xl opacity-10"
        transition={{
          duration: 5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        ⚡
      </motion.div>
      <motion.div
        animate={{
          y: [0, -20, 0],
          scale: [1, 1.2, 1],
        }}
        className="absolute bottom-32 left-1/4 text-4xl opacity-10"
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        💥
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center space-y-8">
        {/* Icon with emoji - animated */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          className="relative"
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <motion.div
            animate={{
              boxShadow: [
                "0 20px 25px -5px rgba(139, 92, 246, 0.1)",
                "0 20px 25px -5px rgba(139, 92, 246, 0.3)",
                "0 20px 25px -5px rgba(139, 92, 246, 0.1)",
              ],
            }}
            className="flex h-32 w-32 items-center justify-center rounded-3xl border-4 border-white/10 bg-gradient-to-b from-purple-500 to-indigo-600 shadow-xl"
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            <motion.svg
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              className="h-20 w-20 text-white"
              fill="none"
              stroke="currentColor"
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              viewBox="0 0 24 24"
            >
              <title>Bot Icon</title>
              <path
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </motion.svg>
          </motion.div>
          <motion.div
            animate={{
              rotate: [0, 20, -20, 0],
              scale: [1, 1.2, 1],
            }}
            className="-top-6 -right-6 absolute flex h-6 w-6 items-center justify-center text-3xl"
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            ⚡
          </motion.div>
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -15, 0],
            }}
            className="-bottom-2 -left-4 absolute text-2xl"
            transition={{
              duration: 1.8,
              repeat: Number.POSITIVE_INFINITY,
              delay: 0.5,
            }}
          >
            💥
          </motion.div>
        </motion.div>

        {/* Title and Message - with animation */}
        <div className="space-y-4 text-center">
          <motion.h2
            animate={{
              opacity: [1, 0.7, 1],
            }}
            className="font-medium text-2xl text-white"
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            Training your chaos bot...
          </motion.h2>
          <AnimatePresence mode="wait">
            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className="text-indigo-300"
              exit={{ opacity: 0, y: -10 }}
              initial={{ opacity: 0, y: 10 }}
              key={progress.message}
              transition={{ duration: 0.3 }}
            >
              {progress.message}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress Bar - enhanced */}
        <div className="w-full space-y-4">
          <div className="rounded-full border border-white/10 bg-white/5 p-3">
            <div className="h-3 overflow-hidden rounded-full bg-black/20">
              <motion.div
                animate={{ width: `${progress.progress}%` }}
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-600"
                initial={{ width: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
          <motion.p
            animate={{
              opacity: [1, 0.6, 1],
            }}
            className="text-center text-purple-400"
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            {progress.progress}%
          </motion.p>
        </div>

        {/* Loading dots - enhanced */}
        <div className="flex justify-center gap-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              animate={{
                y: [0, -15, 0],
                scale: [1, 1.2, 1],
              }}
              className="h-3 w-3 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600"
              key={i}
              transition={{
                duration: 0.8,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
