"use client";

import { Button } from "@/components/ui/button";

type MainFlowProps = {
  onCreateAgent: () => void;
  onViewMarketplace: () => void;
};

export function MainFlow({ onCreateAgent, onViewMarketplace }: MainFlowProps) {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#1a0b2e] via-[#2d1b4e] to-[#1e1b4b] p-6">
      {/* Background elements */}
      <div className="absolute top-20 left-20 h-96 w-96 rounded-full bg-purple-500 opacity-20 blur-3xl" />
      <div className="absolute right-20 bottom-20 h-96 w-96 rounded-full bg-indigo-600 opacity-30 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center space-y-8 text-center">
        {/* Icon */}
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
          <div className="-top-6 -right-6 absolute text-3xl">⚡</div>
          <div className="-bottom-2 -left-4 absolute text-2xl">💥</div>
        </div>

        {/* Title & Description */}
        <div className="space-y-4">
          <h1 className="font-bold text-4xl text-white">Welcome to Xbtify</h1>
          <p className="text-indigo-200 text-lg">
            Create your AI chaos twin that vibes just like you on Farcaster
          </p>
        </div>

        {/* CTAs */}
        <div className="flex w-full flex-col gap-4">
          <Button
            className="h-14 w-full rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 font-semibold text-lg text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
            onClick={onCreateAgent}
          >
            Create Your Agent 🚀
          </Button>

          <Button
            className="h-14 w-full rounded-2xl border-2 border-white/20 bg-white/5 font-medium text-lg text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10"
            onClick={onViewMarketplace}
            variant="outline"
          >
            View Other Agents 👀
          </Button>
        </div>

        {/* Footer hint */}
        <p className="text-indigo-300/60 text-sm">
          Your agent will learn from your posts and interact with your style
        </p>
      </div>
    </div>
  );
}
