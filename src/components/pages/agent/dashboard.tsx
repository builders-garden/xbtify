"use client";

import { Bell, ShoppingCart, User } from "lucide-react";
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
    <div className="relative flex min-h-screen w-full justify-center overflow-hidden bg-gradient-to-b from-[#1a0b2e] via-[#2d1b4e] to-[#1e1b4b]">
      <div className="absolute top-12 left-12 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
      <div className="absolute right-16 bottom-16 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl" />

      <div className="relative z-10 flex w-full max-w-3xl flex-col text-white">
        <Tabs
          className="flex h-screen w-full flex-col"
          onValueChange={setActiveTab}
          value={activeTab}
        >
          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-3 pb-24">
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

          {/* Bottom Navigation */}
          <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-3xl">
            <TabsList className="grid h-auto w-full grid-cols-3 gap-0 rounded-none border-white/10 border-t bg-black/40 p-0 backdrop-blur-xl">
              <TabsTrigger
                className="flex flex-col items-center gap-1 rounded-none border-none bg-transparent px-4 py-3 text-white/60 transition hover:bg-white/5 data-[state=active]:bg-transparent data-[state=active]:text-white"
                value="my-agent"
              >
                <User className="h-6 w-6" />
                <span className="text-xs">My Agent</span>
              </TabsTrigger>

              <TabsTrigger
                className="flex flex-col items-center gap-1 rounded-none border-none bg-transparent px-4 py-3 text-white/60 transition hover:bg-white/5 data-[state=active]:bg-transparent data-[state=active]:text-white"
                value="activity"
              >
                <Bell className="h-6 w-6" />
                <span className="text-xs">Activity</span>
              </TabsTrigger>

              <TabsTrigger
                className="flex flex-col items-center gap-1 rounded-none border-none bg-transparent px-4 py-3 text-white/60 transition hover:bg-white/5 data-[state=active]:bg-transparent data-[state=active]:text-white"
                value="marketplace"
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="text-xs">Marketplace</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
