"use client";

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
      {/* Content */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center space-y-8">
        {/* Icon with emoji */}
        <div className="relative">
          <div className="flex h-32 w-32 items-center justify-center rounded-3xl border-4 border-white/10 bg-gradient-to-b from-purple-500 to-indigo-600 shadow-xl">
            <svg
              className="h-20 w-20 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Bot Icon</title>
              <path
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
          <div className="-top-6 -right-6 absolute flex h-6 w-6 items-center justify-center">
            ⚡
          </div>
          <div className="-bottom-2 -left-4 absolute text-2xl">💥</div>
        </div>

        {/* Title and Message */}
        <div className="space-y-4 text-center">
          <h2 className="font-medium text-2xl text-white">
            Training your chaos bot...
          </h2>
          <p className="text-indigo-300">{progress.message}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-4">
          <div className="rounded-full border border-white/10 bg-white/5 p-3">
            <div className="h-3 overflow-hidden rounded-full bg-black/20">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-500 ease-out"
                style={{ width: `${progress.progress}%` }}
              />
            </div>
          </div>
          <p className="text-center text-purple-400">{progress.progress}%</p>
        </div>

        {/* Loading dots */}
        <div className="flex justify-center gap-3">
          <div className="h-3 w-3 animate-bounce rounded-full bg-purple-500" />
          <div className="h-3 w-3 animate-bounce rounded-full bg-indigo-600 [animation-delay:0.2s]" />
          <div className="h-3 w-3 animate-bounce rounded-full bg-blue-700 [animation-delay:0.4s]" />
        </div>
      </div>
    </div>
  );
}
