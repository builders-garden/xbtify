"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Agent } from "@/lib/database/db.schema";
import { ExploreTab } from "./explore-tab";
import { FeedTab } from "./feed-tab";
import { MyAgentTab } from "./my-agent-tab";

type DashboardProps = {
  agent: Agent;
  onUpdateAgent: (agent: Partial<Agent>) => void;
  creatorUsername?: string;
};

export function Dashboard({
  agent,
  onUpdateAgent,
  creatorUsername,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState("feed");

  return (
    <div className="relative flex min-h-screen w-full justify-center overflow-hidden">
      <div className="relative z-10 flex w-full max-w-3xl flex-col text-white">
        <Tabs
          className="flex h-screen w-full flex-col"
          onValueChange={setActiveTab}
          value={activeTab}
        >
          {/* Content Area */}
          <div className="relative flex-1 overflow-y-auto overflow-x-hidden p-4 pb-24">
            <AnimatePresence mode="wait">
              {activeTab === "feed" && (
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  className="h-full"
                  exit={{ opacity: 0, x: -20 }}
                  initial={{ opacity: 0, x: 20 }}
                  key="feed"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <TabsContent className="m-0 h-full" value="feed">
                    <FeedTab agentFid={agent.fid} />
                  </TabsContent>
                </motion.div>
              )}

              {activeTab === "explore" && (
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  className="h-full"
                  exit={{ opacity: 0, x: -20 }}
                  initial={{ opacity: 0, x: 20 }}
                  key="explore"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <TabsContent className="m-0 h-full" value="explore">
                    <ExploreTab />
                  </TabsContent>
                </motion.div>
              )}

              {activeTab === "my-agent" && (
                <motion.div
                  animate={{ opacity: 1, x: 0 }}
                  className="h-full"
                  exit={{ opacity: 0, x: -20 }}
                  initial={{ opacity: 0, x: 20 }}
                  key="my-agent"
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <TabsContent className="m-0 h-full" value="my-agent">
                    <MyAgentTab
                      agent={agent}
                      creatorUsername={creatorUsername}
                      onUpdateAgent={onUpdateAgent}
                    />
                  </TabsContent>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Navigation */}
          <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-3xl">
            <TabsList className="relative grid h-auto w-full grid-cols-3 gap-0 rounded-none border-white/10 border-t bg-black/40 p-0 backdrop-blur-xl">
              {/* Active indicator */}
              <motion.div
                animate={{
                  x:
                    activeTab === "feed"
                      ? "0%"
                      : activeTab === "explore"
                        ? "100%"
                        : "200%",
                }}
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-purple-500/20 to-indigo-600/20"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />

              <TabsTrigger
                className="relative flex cursor-pointer flex-col items-center gap-0 rounded-none border-none bg-transparent px-4 py-3 text-white/60 transition hover:bg-white/5 data-[state=active]:bg-transparent data-[state=active]:text-white"
                value="feed"
              >
                <motion.div
                  animate={{
                    scale: activeTab === "feed" ? 1.1 : 1,
                    rotate: activeTab === "feed" ? [0, -10, 10, 0] : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    alt="Feed"
                    className="h-9 w-9"
                    height={28}
                    src="/images/activity.png"
                    width={28}
                  />
                </motion.div>
                <span className="text-sm">Feed</span>
              </TabsTrigger>

              <TabsTrigger
                className="relative flex cursor-pointer flex-col items-center gap-0 rounded-none border-none bg-transparent px-4 py-3 text-white/60 transition hover:bg-white/5 data-[state=active]:bg-transparent data-[state=active]:text-white"
                value="explore"
              >
                <motion.div
                  animate={{
                    scale: activeTab === "explore" ? 1.1 : 1,
                    rotate: activeTab === "explore" ? [0, -10, 10, 0] : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    alt="Explore"
                    className="h-9 w-9 brightness-150"
                    height={28}
                    src="/images/explore.png"
                    width={28}
                  />
                </motion.div>
                <span className="text-sm">Explore</span>
              </TabsTrigger>

              <TabsTrigger
                className="relative flex cursor-pointer flex-col items-center gap-0 rounded-none border-none bg-transparent px-4 py-3 text-white/60 transition hover:bg-white/5 data-[state=active]:bg-transparent data-[state=active]:text-white"
                value="my-agent"
              >
                <motion.div
                  animate={{
                    scale: activeTab === "my-agent" ? 1.1 : 1,
                    rotate: activeTab === "my-agent" ? [0, -10, 10, 0] : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    alt="Agent"
                    className="h-9 w-9"
                    height={28}
                    src="/images/my_agent.png"
                    width={28}
                  />
                </motion.div>
                <span className="text-sm">My Agent</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
