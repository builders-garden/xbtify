"use client";

import { sdk } from "@farcaster/miniapp-sdk";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const BASE_USDC_ADDRESS =
  "eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const AMOUNT = "5000000"; // 5 USDC (6 decimals)

type PaymentStepProps = {
  onPaymentSuccess: (txHash: string) => void;
  onBack: () => void;
};

export function PaymentStep({ onPaymentSuccess, onBack }: PaymentStepProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const result = await sdk.actions.sendToken({
        token: BASE_USDC_ADDRESS,
        amount: AMOUNT,
        recipientAddress: "0xa52D5b2B7115e1086533EA1f835826B4e01E5B31",
      });

      if (result.success) {
        toast.success("Payment successful!");
        onPaymentSuccess(result.send.transaction);
      } else {
        console.error("Payment failed:", result.error);

        if (result.reason === "rejected_by_user") {
          toast.error("Payment was cancelled by user");
        } else if (result.reason === "send_failed") {
          const errorMessage = result.error?.message || "Payment failed";
          toast.error(`Payment failed: ${errorMessage}`);
        } else {
          toast.error("Payment failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(`Payment error: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden">
      {/* Content */}
      <div className="relative z-50 flex h-full w-full flex-col">
        {/* Top Section - Fixed Header */}
        <div className="flex-shrink-0 px-6 pt-8 pb-4">
          <div className="mx-auto w-full max-w-2xl">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
              initial={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="mb-3 font-bold font-jersey text-3xl text-white">
                Charge up your AI Twin ⚡
              </h2>
              <p className="text-base text-indigo-300/80">
                To create your AI twin you'll need to charge it up with credits
              </p>
            </motion.div>
          </div>
        </div>

        {/* Middle Section - Payment Info */}
        <div className="relative flex flex-1 items-center justify-center px-6">
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="relative text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Glowing container */}
            <div className="relative rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-indigo-600/10 p-8 backdrop-blur-sm">
              {/* Animated glow */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-500/20 to-indigo-600/20 blur-xl"
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />

              {/* Content */}
              <div className="relative z-10 space-y-6">
                {/* Price display */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  className="space-y-2"
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <div className="text-6xl">💰</div>
                  <div className="space-y-1">
                    <p className="font-bold font-jersey text-4xl text-white">
                      5 USDC
                    </p>
                    <p className="text-purple-300 text-sm">Testing amount</p>
                  </div>
                </motion.div>

                {/* Features */}
                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-sm text-white">
                      24/7 automatic replies
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-sm text-white">
                      Personalized AI responses
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-sm text-white">
                      Base DM integration
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section - Action Buttons */}
        <div className="flex-shrink-0 px-6 pb-8">
          <div className="mx-auto w-full max-w-2xl space-y-3">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                className="relative h-12 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 font-semibold text-base text-white shadow-lg transition-transform hover:scale-105 hover:cursor-pointer active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isProcessing}
                onClick={handlePayment}
              >
                <AnimatePresence mode="wait">
                  {isProcessing ? (
                    <motion.div
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                      exit={{ opacity: 0 }}
                      initial={{ opacity: 0 }}
                      key="processing"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      />
                      Processing Payment...
                    </motion.div>
                  ) : (
                    <motion.span
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      initial={{ opacity: 0 }}
                      key="pay"
                    >
                      Pay 5 USDC 💫
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Shimmer effect */}
                <motion.div
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
              </Button>

              <Button
                className="h-11 w-full rounded-2xl border-2 border-white/20 bg-white/5 font-medium text-sm text-white backdrop-blur-sm transition-all hover:cursor-pointer hover:border-white/40 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isProcessing}
                onClick={onBack}
                variant="outline"
              >
                ← Back to Questions
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
