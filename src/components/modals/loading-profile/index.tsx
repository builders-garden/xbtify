"use client";

import { Loader2Icon, XIcon } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useFarcaster } from "@/contexts/farcaster-context";

type LoadingProfileProps = {
  onClose: () => void;
};

export function LoadingProfileModal({ onClose }: LoadingProfileProps) {
  const { safeAreaInsets } = useFarcaster();

  return (
    <div className="no-scrollbar fixed inset-0 z-50 flex size-full max-h-screen items-center justify-center">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="h-[calc(100%-env(safe-area-inset-top)-env(safe-area-inset-bottom))] w-full bg-background text-foreground"
        exit={{ opacity: 0, y: 50 }}
        initial={{ opacity: 0, y: 50 }}
      >
        <div
          className="mx-auto flex h-full w-full flex-col px-2 py-3"
          style={{
            marginTop: safeAreaInsets.top,
            marginBottom: safeAreaInsets.bottom,
            marginLeft: safeAreaInsets.left,
            marginRight: safeAreaInsets.right,
          }}
        >
          {/* Header */}
          <div className="mb-2 flex items-center justify-between px-1">
            <h2 className="font-bold text-lg xs:text-xl">Loading Profile</h2>
            <Button
              className="flex items-center justify-center text-2xl"
              onClick={onClose}
              size="icon"
              variant="ghost"
            >
              <XIcon className="size-4" />
            </Button>
          </div>

          {/* Content area */}
          <div className="flex size-full items-center justify-center gap-2">
            <div className="flex h-fit w-full items-center justify-center gap-4">
              <Loader2Icon className="h-4 w-4 animate-spin" />
              <span className="text-muted-foreground text-sm">
                Searching...
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
