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
    <div className="flex h-full w-full flex-col">
      <Tabs
        className="flex h-full w-full flex-col"
        onValueChange={setActiveTab}
        value={activeTab}
      >
        <TabsList className="grid w-full grid-cols-3 rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            className="rounded-none border-transparent border-b-2 data-[state=active]:border-purple-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            value="my-agent"
          >
            My Agent
          </TabsTrigger>
          <TabsTrigger
            className="rounded-none border-transparent border-b-2 data-[state=active]:border-purple-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            value="activity"
          >
            Activity
          </TabsTrigger>
          <TabsTrigger
            className="rounded-none border-transparent border-b-2 data-[state=active]:border-purple-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            value="marketplace"
          >
            Marketplace
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto">
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
  );
}
