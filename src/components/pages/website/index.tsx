import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { env } from "@/lib/env";

export const Website = ({ page }: { page?: string }) => {
  const pageUrl = `https://farcaster.xyz/?launchFrameUrl=${
    env.NEXT_PUBLIC_URL
  }${page ? `/${page}` : ""}`;

  return (
    <main className="relative z-10 flex h-screen w-full items-center justify-center overflow-y-auto p-6">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-8 text-center sm:gap-6">
        {/* App Icon */}
        <div className="relative">
          <div className="-inset-4 absolute animate-pulse rounded-full bg-purple-500/20 blur-2xl" />
          <Image
            alt={`${env.NEXT_PUBLIC_APPLICATION_NAME} Logo`}
            className="relative h-24 w-24 rounded-2xl object-contain shadow-2xl shadow-purple-500/50 sm:h-32 sm:w-32"
            height={128}
            src="/images/icon.png"
            width={128}
          />
        </div>

        {/* App Name - Big and Bold */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <h1 className="font-bold font-jersey text-6xl text-white tracking-tight drop-shadow-2xl sm:text-7xl md:text-8xl lg:text-9xl">
            {env.NEXT_PUBLIC_APPLICATION_NAME}
          </h1>
          <p className="font-light text-white/90 text-xl sm:text-2xl md:text-3xl">
            Your AI twin, online 24/7
          </p>
        </div>

        {/* QR Code and Button Section */}
        <div className="flex flex-col items-center gap-6 sm:gap-8">
          {/* QR Code */}
          <div className="group relative">
            <div className="-inset-2 absolute rounded-2xl bg-gradient-to-r from-purple-500/30 to-pink-500/30 opacity-75 blur-xl transition duration-500 group-hover:opacity-100" />
            <div className="relative rounded-2xl border-2 border-white/30 bg-white/95 p-4 shadow-2xl backdrop-blur-sm sm:p-6">
              <QRCodeSVG
                className="h-40 w-40 sm:h-48 sm:w-48"
                value={pageUrl}
              />
            </div>
          </div>

          {/* Farcaster Button */}
          <a
            className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 font-semibold text-lg text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-purple-500/50 sm:gap-4 sm:px-12 sm:py-5 sm:text-xl"
            href={pageUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
            <svg
              className="relative h-8 w-8 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 sm:h-10 sm:w-10"
              fill="none"
              height="100"
              viewBox="0 0 1000 1000"
              width="100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Farcaster</title>
              <path
                d="M257.778 155.556H742.222V844.445H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.445H257.778V155.556Z"
                fill="white"
              />
              <path
                d="M128.889 253.333L157.778 351.111H182.222V746.667C169.949 746.667 160 756.616 160 768.889V795.556H155.556C143.283 795.556 133.333 805.505 133.333 817.778V844.445H382.222V817.778C382.222 805.505 372.273 795.556 360 795.556H355.556V768.889C355.556 756.616 345.606 746.667 333.333 746.667H306.667V253.333H128.889Z"
                fill="white"
              />
              <path
                d="M675.556 746.667C663.282 746.667 653.333 756.616 653.333 768.889V795.556H648.889C636.616 795.556 626.667 805.505 626.667 817.778V844.445H875.556V817.778C875.556 805.505 865.606 795.556 853.333 795.556H848.889V768.889C848.889 756.616 838.94 746.667 826.667 746.667V351.111H851.111L880 253.333H702.222V746.667H675.556Z"
                fill="white"
              />
            </svg>
            <span className="relative">Launch on Farcaster</span>
          </a>
        </div>

        {/* Footer */}
        <div className="mt-8 text-sm text-white/60 sm:text-base">
          Built by{" "}
          <a
            className="text-white/80 underline transition-colors hover:text-white"
            href="https://builders.garden"
            rel="noopener noreferrer"
            target="_blank"
          >
            Builders Garden
          </a>
        </div>
      </div>
    </main>
  );
};
