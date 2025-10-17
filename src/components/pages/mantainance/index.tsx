import { motion } from "motion/react";
import { CountdownTimer } from "./countdown-timer";

export const Maintenance = ({ maintenanceEnd }: { maintenanceEnd: Date }) => (
  <main className="mx-auto h-full w-screen max-w-md overflow-hidden">
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
      <div className="absolute inset-0 bg-black/70" />
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 flex max-w-md flex-col gap-6 rounded-xl border border-white/20 bg-white/10 p-6 py-8 backdrop-blur-md"
        initial={{ opacity: 0, scale: 0.9 }}
      >
        <motion.h2
          animate={{
            color: ["#4ade80", "#22c55e", "#4ade80"],
          }}
          className="text-center font-bold text-2xl"
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          {new Date() > maintenanceEnd
            ? "Maintenance Complete!"
            : "Ongoing Maintenance"}
        </motion.h2>

        <p className="text-center text-sm text-white/90 leading-relaxed">
          The app is currently undergoing maintenance.
        </p>
        <CountdownTimer maintenanceEnd={maintenanceEnd} />
      </motion.div>
    </div>
  </main>
);
