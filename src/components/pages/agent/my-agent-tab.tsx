"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserAvatar } from "@/components/ui/user-avatar";
import type { Agent } from "@/types/agent.type";

type MyAgentTabProps = {
  agent: Agent;
  onUpdateAgent: (agent: Partial<Agent>) => void;
};

export function MyAgentTab({ agent, onUpdateAgent }: MyAgentTabProps) {
  const [personality, setPersonality] = useState(agent.personality || "");
  const [chaosLevel, setChaosLevel] = useState(agent.chaosLevel || 50);
  const [autoRespond, setAutoRespond] = useState(
    agent.settings?.autoRespond ?? true
  );
  const [dmEnabled, setDmEnabled] = useState(
    agent.settings?.dmEnabled ?? false
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onUpdateAgent({
      personality,
      chaosLevel,
      settings: {
        ...(agent.settings || {}),
        autoRespond,
        dmEnabled,
      },
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setPersonality(agent.personality || "");
    setChaosLevel(agent.chaosLevel || 50);
    setAutoRespond(agent.settings?.autoRespond ?? true);
    setDmEnabled(agent.settings?.dmEnabled ?? false);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-4 pb-20 text-white">
      {/* Agent Header */}
      <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
        <UserAvatar
          alt={agent.name}
          avatarUrl={agent.avatarUrl ?? null}
          size="xl"
        />
        <div className="flex flex-col">
          <h2 className="font-semibold text-white text-xl">{agent.name}</h2>
          <p className="text-sm text-white/60">@{agent.username}</p>
        </div>
      </div>

      {/* Agent Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <p className="font-semibold text-2xl text-white">
            {agent.stats?.totalReplies ?? 0}
          </p>
          <p className="text-white/60 text-xs">Replies</p>
        </div>
        <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <p className="font-semibold text-2xl text-white">
            {agent.stats?.pendingReview ?? 0}
          </p>
          <p className="text-white/60 text-xs">Pending</p>
        </div>
        <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <p className="font-semibold text-2xl text-white">
            {agent.stats?.vibeScore ?? 0}
          </p>
          <p className="text-white/60 text-xs">Vibe Score</p>
        </div>
      </div>

      {/* Personality Configuration */}
      <div className="flex flex-col gap-2">
        <Label className="text-white/80" htmlFor="personality">
          Agent Personality
        </Label>
        <textarea
          className="min-h-32 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          id="personality"
          onChange={(e) => {
            setPersonality(e.target.value);
            setIsEditing(true);
          }}
          placeholder="Describe your agent's personality, tone, and style..."
          value={personality}
        />
      </div>

      {/* Chaos Level Slider */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label className="text-white/80" htmlFor="chaos-level">
            Chaos Level
          </Label>
          <span className="font-medium text-sm text-white/80">
            {chaosLevel}%
          </span>
        </div>
        <input
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/20 accent-purple-500"
          id="chaos-level"
          max="100"
          min="0"
          onChange={(e) => {
            setChaosLevel(Number(e.target.value));
            setIsEditing(true);
          }}
          type="range"
          value={chaosLevel}
        />
        <p className="text-white/60 text-xs">
          Higher chaos = more unpredictable and creative responses
        </p>
      </div>

      {/* Settings Toggles */}
      <div className="flex flex-col gap-4">
        <h3 className="font-semibold text-white/90">Settings</h3>

        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div className="flex flex-col gap-1">
            <p className="font-medium text-white">Auto-respond</p>
            <p className="text-white/60 text-xs">
              Automatically reply to mentions
            </p>
          </div>
          <button
            className={`relative inline-flex h-6 w-12 items-center rounded-full border border-white/10 transition-colors ${
              autoRespond
                ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                : "bg-white/10"
            }`}
            onClick={() => {
              setAutoRespond(!autoRespond);
              setIsEditing(true);
            }}
            type="button"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                autoRespond ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <div className="flex flex-col gap-1">
            <p className="font-medium text-white">DMs Enabled</p>
            <p className="text-white/60 text-xs">Allow direct messages</p>
          </div>
          <button
            className={`relative inline-flex h-6 w-12 items-center rounded-full border border-white/10 transition-colors ${
              dmEnabled
                ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                : "bg-white/10"
            }`}
            onClick={() => {
              setDmEnabled(!dmEnabled);
              setIsEditing(true);
            }}
            type="button"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                dmEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Save/Cancel Buttons */}
      {isEditing && (
        <div className="flex gap-2">
          <Button
            className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg transition hover:from-purple-400 hover:to-indigo-400"
            onClick={handleSave}
          >
            Save Changes
          </Button>
          <Button
            className="flex-1 border-white/30 bg-white/10 text-white hover:bg-white/20"
            onClick={handleCancel}
            variant="outline"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
