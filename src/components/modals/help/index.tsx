"use client";

import { XIcon } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useFarcaster } from "@/contexts/farcaster-context";

type HelpModalProps = {
  onClose: () => void;
};

export function HelpModal({ onClose }: HelpModalProps) {
  const { safeAreaInsets } = useFarcaster();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="h-[calc(100%-env(safe-area-inset-top)-env(safe-area-inset-bottom))] w-full bg-[#7E4E31]"
        exit={{ opacity: 0, y: 50 }}
        initial={{ opacity: 0, y: 50 }}
      >
        <div
          className="mx-auto flex h-full w-full max-w-4xl flex-col p-3 xs:p-4"
          style={{
            marginTop: safeAreaInsets.top,
            marginBottom: safeAreaInsets.bottom,
            marginLeft: safeAreaInsets.left,
            marginRight: safeAreaInsets.right,
          }}
        >
          {/* Header */}
          <div className="mb-2 xs:mb-4 flex items-center justify-end">
            <Button
              className="flex items-center justify-center text-2xl text-white/90"
              onClick={onClose}
              size="icon"
              variant="ghost"
            >
              <XIcon className="size-7 sm:size-8" />
            </Button>
          </div>

          {/* Content area */}
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 xs:gap-4">
            {/* If you need help */}
            <div className="flex flex-col items-center gap-3 xs:gap-4 text-center text-white/90">
              <div className="flex flex-col items-center gap-0.5 xs:gap-1">
                <p className="font-medium text-sm text-white/80 xs:text-base">
                  If you need help, please contact support.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex-none p-3 xs:p-4">
            <div className="flex justify-center gap-2 xs:gap-3">
              <Button
                className="rounded-lg bg-black/10 px-4 xs:px-6 py-2 xs:py-2.5 font-medium text-white/90 text-xs xs:text-sm transition-colors hover:bg-black/30"
                onClick={onClose}
              >
                Cancel
              </Button>

              <Button
                className="rounded-lg bg-green-600/80 px-4 xs:px-6 py-2 xs:py-2.5 font-medium text-white text-xs xs:text-sm transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-green-600/20 disabled:text-white/50"
                disabled={false}
                onClick={onClose}
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
