"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Agent } from "@/types/agent.type";
import { ActivityTab } from "./activity-tab";
import { MarketplaceTab } from "./marketplace-tab";
import { MyAgentTab } from "./my-agent-tab";

type DashboardProps = {
  agent: Agent;
  onUpdateAgent: (agent: Partial<Agent>) => void;
};

export function Dashboard({ agent, onUpdateAgent }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("my-agent");

  return (
    <div className="relative flex min-h-screen w-full justify-center overflow-hidden bg-gradient-to-b from-[#1a0b2e] via-[#2d1b4e] to-[#1e1b4b] p-3">
      <div className="absolute top-12 left-12 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
      <div className="absolute right-16 bottom-16 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl" />

      <div className="relative z-10 w-full max-w-3xl text-white">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
          <Tabs
            className="flex h-full w-full flex-col"
            onValueChange={setActiveTab}
            value={activeTab}
          >
            <TabsList className="grid w-full grid-cols-3 rounded-none border-white/10 border-b bg-white/10 p-0 backdrop-blur">
              <TabsTrigger
                className="rounded-none border-transparent border-b-2 px-4 py-4 font-semibold text-white/60 transition data-[state=active]:border-white data-[state=active]:bg-white/5 data-[state=active]:text-white"
                value="my-agent"
              >
                My Agent
              </TabsTrigger>
              <TabsTrigger
                className="rounded-none border-transparent border-b-2 px-4 py-4 font-semibold text-white/60 transition data-[state=active]:border-white data-[state=active]:bg-white/5 data-[state=active]:text-white"
                value="activity"
              >
                Activity
              </TabsTrigger>
              <TabsTrigger
                className="rounded-none border-transparent border-b-2 px-4 py-4 font-semibold text-white/60 transition data-[state=active]:border-white data-[state=active]:bg-white/5 data-[state=active]:text-white"
                value="marketplace"
              >
                Marketplace
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto p-6">
              <TabsContent className="m-0 h-full" value="my-agent">
                <MyAgentTab agent={agent} onUpdateAgent={onUpdateAgent} />
              </TabsContent>

              <TabsContent className="m-0 h-full" value="activity">
                <ActivityTab agentId={agent.id} />
              </TabsContent>

              <TabsContent className="m-0 h-full" value="marketplace">
                <MarketplaceTab />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
