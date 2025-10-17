"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAgent, useCreateAgent, useUpdateAgent } from "@/hooks/use-agent";
import type { Agent } from "@/types/agent.type";
import { Dashboard } from "./dashboard";
import { LoadingScreen } from "./loading-screen";
import { MainFlow } from "./main-flow";

export function AgentPage() {
  const [isCreating, setIsCreating] = useState(false);
  const { data: agent, isLoading: isLoadingAgent } = useAgent();
  const createAgent = useCreateAgent();
  const updateAgent = useUpdateAgent();

  const handleCreateAgent = async () => {
    setIsCreating(true);

    try {
      await createAgent.mutateAsync({});
      toast.success("Agent created successfully!");
    } catch (error) {
      console.error("Error creating agent:", error);
      toast.error("Failed to create agent. Please try again.");
    } finally {
      setIsCreating(false);
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

  // Show loading screen while creating agent
  if (isCreating) {
    return <LoadingScreen />;
  }

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

  // If user doesn't have an agent, show main flow
  if (!agent) {
    return (
      <MainFlow
        onCreateAgent={handleCreateAgent}
        onViewMarketplace={handleViewMarketplace}
      />
    );
  }

  // If user has an agent, show dashboard
  return <Dashboard agent={agent} onUpdateAgent={handleUpdateAgent} />;
}
