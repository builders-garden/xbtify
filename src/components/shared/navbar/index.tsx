"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useApp } from "@/contexts/app-context";
import { env } from "@/lib/env";
import { PageContent } from "@/types/enums";
import { UserProfile } from "./user-profile";

export const Navbar = () => {
  const { handlePageChange } = useApp();

  const goHome = () => {
    handlePageChange(PageContent.HOME);
  };

  return (
    <motion.header
      animate={{ opacity: 1, y: 0 }}
      className="z-50 flex w-full items-center justify-between px-2 text-white"
      id="navbar"
      initial={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="flex w-fit cursor-pointer items-center justify-start text-black"
        onClick={goHome}
      >
        <Image
          alt="logo"
          className="h-10 w-10 p-1"
          height={30}
          src="/images/icon.png"
          width={30}
        />
        <span className="font-bold text-xl" style={{ fontWeight: 500 }}>
          {env.NEXT_PUBLIC_APPLICATION_NAME}
        </span>
      </div>

      <UserProfile />
    </motion.header>
  );
};
