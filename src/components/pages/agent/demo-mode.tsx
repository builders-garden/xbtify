"use client";

import { useState } from "react";
import type { Agent } from "@/types/agent.type";
import { Dashboard } from "./dashboard";
import { LoadingScreen } from "./loading-screen";
import { MainFlow } from "./main-flow";

/**
 * Demo Mode Component for visual testing
 * Allows testing all flows without DB integration
 */
export function DemoMode() {
  const [mode, setMode] = useState<"no-agent" | "creating" | "has-agent">(
    "no-agent"
  );
  const [mockAgent, setMockAgent] = useState<Agent | null>(null);

  const handleCreateAgent = () => {
    setMode("creating");
    // Simulate agent creation
    setTimeout(() => {
      const newAgent: Agent = {
        id: "demo-agent-123",
        username: "demo_user",
        name: "Demo User",
        bio: "Just vibing with AI chaos! 🚀",
        personality:
          "I'm a chaotic agent that loves to vibe with crypto trends! 🚀💥",
        chaosLevel: 75,
        isLive: true,
        settings: {
          autoRespond: true,
          dmEnabled: true,
        },
        stats: {
          totalReplies: 127,
          pendingReview: 3,
          vibeScore: 89,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setMockAgent(newAgent);
      setMode("has-agent");
    }, 8000); // 8 seconds for loading screen demo
  };

  const handleViewMarketplace = () => {
    // In demo mode, just switch to has-agent with mock data
    if (!mockAgent) {
      const newAgent: Agent = {
        id: "demo-agent-123",
        username: "demo_user",
        name: "Demo User",
        bio: "Just vibing with AI chaos! 🚀",
        personality:
          "I'm a chaotic agent that loves to vibe with crypto trends! 🚀💥",
        chaosLevel: 75,
        isLive: true,
        settings: {
          autoRespond: true,
          dmEnabled: true,
        },
        stats: {
          totalReplies: 127,
          pendingReview: 3,
          vibeScore: 89,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setMockAgent(newAgent);
    }
    setMode("has-agent");
  };

  const handleUpdateAgent = (updates: Partial<Agent>) => {
    if (mockAgent) {
      setMockAgent({
        ...mockAgent,
        ...updates,
        updatedAt: new Date(),
      });
    }
  };

  const handleResetDemo = () => {
    setMockAgent(null);
    setMode("no-agent");
  };

  if (mode === "no-agent") {
    return (
      <div className="relative">
        <MainFlow
          onCreateAgent={handleCreateAgent}
          onViewMarketplace={handleViewMarketplace}
        />
        {/* Demo Mode Indicator */}
        <div className="fixed top-4 right-4 z-50 rounded-lg bg-purple-500/90 px-4 py-2 text-sm text-white backdrop-blur-sm">
          🎨 Demo Mode
        </div>
      </div>
    );
  }

  if (mode === "creating") {
    return <LoadingScreen />;
  }

  if (mode === "has-agent" && mockAgent) {
    return (
      <div className="relative">
        <Dashboard agent={mockAgent} onUpdateAgent={handleUpdateAgent} />
        {/* Demo Mode Controls */}
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
          <div className="rounded-lg bg-purple-500/90 px-4 py-2 text-sm text-white backdrop-blur-sm">
            🎨 Demo Mode
          </div>
          <button
            className="rounded-lg bg-red-500/90 px-4 py-2 text-sm text-white backdrop-blur-sm transition-colors hover:bg-red-600/90"
            onClick={handleResetDemo}
            type="button"
          >
            Reset Demo
          </button>
        </div>
      </div>
    );
  }

  return null;
}
