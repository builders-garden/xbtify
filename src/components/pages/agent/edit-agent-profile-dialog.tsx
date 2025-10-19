"use client";

import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateAgentProfile } from "@/hooks/use-update-agent-profile";
import type { Agent } from "@/lib/database/db.schema";

type EditAgentProfileDialogProps = {
  agent: Agent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditAgentProfileDialog({
  agent,
  open,
  onOpenChange,
}: EditAgentProfileDialogProps) {
  const { updateProfile, isLoading } = useUpdateAgentProfile();

  const [formData, setFormData] = useState({
    displayName: agent.displayName || "",
    username: agent.username || "",
    bio: "", // Note: bio field doesn't exist in Agent schema yet
    avatarUrl: agent.avatarUrl || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Only send fields that have changed
    const updates: {
      displayName?: string;
      username?: string;
      bio?: string;
      avatarUrl?: string;
    } = {};

    if (formData.displayName !== (agent.displayName || "")) {
      updates.displayName = formData.displayName;
    }
    if (formData.username !== (agent.username || "")) {
      updates.username = formData.username;
    }
    if (formData.bio && formData.bio !== "") {
      updates.bio = formData.bio;
    }
    if (formData.avatarUrl !== (agent.avatarUrl || "")) {
      updates.avatarUrl = formData.avatarUrl;
    }

    if (Object.keys(updates).length === 0) {
      onOpenChange(false);
      return;
    }

    updateProfile(updates, {
      onSuccess: () => {
        onOpenChange(false);
      },
      onError: (error) => {
        console.error("Failed to update profile:", error);
        // You might want to show a toast notification here
      },
    });
  };

  const handleCancel = () => {
    // Reset form to original values
    setFormData({
      displayName: agent.displayName || "",
      username: agent.username || "",
      bio: "",
      avatarUrl: agent.avatarUrl || "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="border-purple-400/20 bg-gradient-to-br from-purple-950/95 via-indigo-950/95 to-purple-950/95 text-white backdrop-blur-xl sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-bold font-jersey text-2xl text-white">
            Edit Agent Profile
          </DialogTitle>
          <DialogDescription className="text-purple-200/80">
            Update your agent's Farcaster profile. Changes will sync to Neynar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Display Name */}
            <div className="space-y-2">
              <Label
                className="text-purple-200/80 text-sm"
                htmlFor="displayName"
              >
                Display Name
              </Label>
              <Input
                className="border-purple-400/30 bg-purple-500/10 text-white placeholder:text-purple-300/40 focus:ring-purple-500/60"
                disabled={isLoading}
                id="displayName"
                onChange={(e) =>
                  setFormData({ ...formData, displayName: e.target.value })
                }
                placeholder="Enter display name"
                value={formData.displayName}
              />
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label className="text-purple-200/80 text-sm" htmlFor="username">
                Username
              </Label>
              <Input
                className="border-purple-400/30 bg-purple-500/10 text-white placeholder:text-purple-300/40 focus:ring-purple-500/60"
                disabled={isLoading}
                id="username"
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="Enter username"
                value={formData.username}
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label className="text-purple-200/80 text-sm" htmlFor="bio">
                Bio
              </Label>
              <Textarea
                className="border-purple-400/30 bg-purple-500/10 text-white placeholder:text-purple-300/40 focus:ring-purple-500/60"
                disabled={isLoading}
                id="bio"
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                placeholder="Tell people about your agent..."
                rows={3}
                value={formData.bio}
              />
            </div>

            {/* Avatar URL */}
            <div className="space-y-2">
              <Label className="text-purple-200/80 text-sm" htmlFor="avatarUrl">
                Avatar URL
              </Label>
              <Input
                className="border-purple-400/30 bg-purple-500/10 text-white placeholder:text-purple-300/40 focus:ring-purple-500/60"
                disabled={isLoading}
                id="avatarUrl"
                onChange={(e) =>
                  setFormData({ ...formData, avatarUrl: e.target.value })
                }
                placeholder="https://example.com/avatar.png"
                type="url"
                value={formData.avatarUrl}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              className="cursor-pointer border-purple-400/30 bg-purple-500/10 text-white hover:bg-purple-500/20 hover:text-white"
              disabled={isLoading}
              onClick={handleCancel}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              className="cursor-pointer bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
