"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { useAgent, useCreateAgent, useUpdateAgent } from "@/hooks/use-agent";
import type { Agent } from "@/lib/database/db.schema";
import { Dashboard } from "./dashboard";
import { LoadingScreen } from "./loading-screen";
import { MainFlow } from "./main-flow";
import { OnboardingQuestions } from "./onboarding-questions";

type FlowState = "main" | "onboarding" | "loading";

export function AgentPage() {
  const [flowState, setFlowState] = useState<FlowState>("main");
  const { data: agent, isLoading: isLoadingAgent } = useAgent();
  const createAgent = useCreateAgent();
  const updateAgent = useUpdateAgent();

  const handleStartOnboarding = () => {
    setFlowState("onboarding");
  };

  const handleOnboardingComplete = async (answers: Record<string, string>) => {
    setFlowState("loading");

    // Here you would normally send the answers to your API
    // For now, we'll just mock the creation process
    try {
      // TODO: Include onboarding answers in the agent creation
      console.log("Creating agent with answers:", answers);
      await createAgent.mutateAsync({});
      toast.success("Agent created successfully!");
    } catch (error) {
      console.error("Error creating agent:", error);
      toast.error("Failed to create agent. Please try again.");
      setFlowState("main");
    }
  };

  const handleUpdateAgent = async (updates: Partial<Agent>) => {
    try {
      await updateAgent.mutateAsync(updates);
      toast.success("Agent updated successfully!");
    } catch (error) {
      console.error("Error updating agent:", error);
      toast.error("Failed to update agent. Please try again.");
    }
  };

  const handleViewExplore = () => {
    // TODO: Navigate to explore or trigger explore view
    console.log("View explore");
  };

  // Show loading state while fetching agent data
  if (isLoadingAgent) {
    return (
      <div className="relative flex h-screen w-full flex-col items-center justify-center gap-6">
        {/* Glow effect behind image */}

        <Image
          alt="Loading"
          className="relative z-50 w-full max-w-[16rem] rounded-3xl brightness-110 contrast-125"
          height={640}
          priority
          src="/images/loading.gif"
          style={{
            mixBlendMode: "screen",
          }}
          unoptimized
          width={360}
        />

        <p className="font-semibold text-lg text-white">LOADING...</p>
      </div>
    );
  }

  // If user has an agent, show dashboard
  if (agent) {
    return <Dashboard agent={agent} onUpdateAgent={handleUpdateAgent} />;
  }

  // Flow states for agent creation
  if (flowState === "loading") {
    return <LoadingScreen />;
  }

  if (flowState === "onboarding") {
    return <OnboardingQuestions onComplete={handleOnboardingComplete} />;
  }

  // Default: show main flow
  return (
    <MainFlow
      onCreateAgent={handleStartOnboarding}
      onViewExplore={handleViewExplore}
    />
  );
}
