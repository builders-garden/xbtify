"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAgent, useCreateAgent, useUpdateAgent } from "@/hooks/use-agent";
import type { Agent } from "@/types/agent.type";
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

  const handleViewMarketplace = () => {
    // TODO: Navigate to marketplace or trigger marketplace view
    console.log("View marketplace");
  };

  // Show loading state while fetching agent data
  if (isLoadingAgent) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
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
      onViewMarketplace={handleViewMarketplace}
    />
  );
}
