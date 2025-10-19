"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { useFarcaster } from "@/contexts/farcaster-context";
import { useAgent, useUpdateAgent } from "@/hooks/use-agent";
import { useAgentInfo, useInitAgent } from "@/hooks/use-ai-service";
import { useUpdateUserPayment } from "@/hooks/use-auth-hooks";
import type { Agent } from "@/lib/database/db.schema";
import { Website } from "../website";
import { Dashboard } from "./dashboard";
import { LoadingScreen } from "./loading-screen";
import { MainFlow } from "./main-flow";
import { OnboardingQuestions } from "./onboarding-questions";
import { PaymentStep } from "./payment-step";

type FlowState = "main" | "onboarding" | "payment" | "loading" | "polling";

export const AgentPage = () => {
  const [flowState, setFlowState] = useState<FlowState>("main");
  const { data: agent, isLoading: isLoadingAgent } = useAgent();
  const { user } = useAuth();
  const initAgent = useInitAgent();
  const updateAgent = useUpdateAgent();
  const updateUserPayment = useUpdateUserPayment();
  const [pollingFid, setPollingFid] = useState<number | null>(null);
  const [onboardingAnswers, setOnboardingAnswers] = useState<Record<
    string,
    string
  > | null>(null);
  const { context, isMiniAppReady } = useFarcaster();

  const isFromBrowser =
    (!context && isMiniAppReady) || !(context || isMiniAppReady);

  console.log({
    flowState,
    pollingFid,
    isFromBrowser,
  });

  // Poll agent info when we're in the loading state
  const { data: agentInfo } = useAgentInfo(pollingFid, {
    enabled: flowState === "polling" && pollingFid !== null,
    refetchInterval: 3000, // Poll every 3 seconds
  });

  // Handle polling completion
  useEffect(() => {
    if (flowState === "polling" && agentInfo?.data) {
      if (agentInfo.data.status === "ready") {
        toast.success("Agent created successfully!");
        // Refresh the agent data
        window.location.reload();
      } else if (agentInfo.data.status === "error") {
        toast.error("Failed to create agent. Please try again.");
        setFlowState("main");
        setPollingFid(null);
      }
    }
  }, [agentInfo, flowState]);

  const handleStartOnboarding = () => {
    setFlowState("onboarding");
  };

  const handleOnboardingComplete = (answers: Record<string, string>) => {
    // Store answers and move to payment step
    setOnboardingAnswers(answers);
    setFlowState("payment");
  };

  const handlePaymentSuccess = async (txHash: string) => {
    setFlowState("loading");

    try {
      // Update user payment hash
      const paymentResult = await updateUserPayment.mutateAsync({
        paidTxHash: txHash,
      });

      if (!paymentResult || paymentResult.status !== "ok") {
        throw new Error("Failed to save payment transaction");
      }

      if (!onboardingAnswers) {
        throw new Error("Missing onboarding answers");
      }

      // Map the answers to the expected format
      const { personality, tone, character } = onboardingAnswers;

      if (!personality) {
        throw new Error("Missing personality answer");
      }
      if (!tone) {
        throw new Error("Missing tone answer");
      }
      if (!character) {
        throw new Error("Missing character answer");
      }

      // Call the init endpoint
      await initAgent.mutateAsync({
        personality,
        tone,
        movieCharacter: character,
      });

      // Start polling for status
      setPollingFid(user?.farcasterFid || null);
      setFlowState("polling");
    } catch (error) {
      console.error("Error creating agent:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create agent. Please try again."
      );
      setFlowState("payment"); // Go back to payment step instead of main
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

  const handleBackToOnboarding = () => {
    setFlowState("onboarding");
  };

  const handleViewExplore = () => {
    // TODO: Navigate to explore or trigger explore view
    console.log("View explore");
  };

  if (isFromBrowser) {
    return <Website />;
  }

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

        <p className="font-jersey font-semibold text-lg text-white">
          LOADING...
        </p>
      </div>
    );
  }

  // If user has an agent, show dashboard
  if (agent) {
    return (
      <Dashboard
        agent={agent}
        creatorUsername={user?.farcasterUsername || undefined}
        onUpdateAgent={handleUpdateAgent}
      />
    );
  }

  // Flow states for agent creation
  if (flowState === "loading" || flowState === "polling") {
    return <LoadingScreen />;
  }

  if (flowState === "onboarding") {
    return <OnboardingQuestions onComplete={handleOnboardingComplete} />;
  }

  if (flowState === "payment") {
    return (
      <PaymentStep
        onBack={handleBackToOnboarding}
        onPaymentSuccess={handlePaymentSuccess}
      />
    );
  }

  // Default: show main flow
  return (
    <MainFlow
      onCreateAgent={handleStartOnboarding}
      onViewExplore={handleViewExplore}
    />
  );
};
