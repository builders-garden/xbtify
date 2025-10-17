import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { env } from "@/lib/env";

export const Website = ({ page }: { page?: string }) => {
  const pageUrl = `https://farcaster.xyz/?launchFrameUrl=${
    env.NEXT_PUBLIC_URL
  }${page ? `/${page}` : ""}`;

  return (
    <main className="h-screen w-full overflow-y-auto bg-[#FCF5EC] p-4 text-black sm:p-0">
      <div className="mx-auto mb-32 flex min-h-full w-full max-w-7xl flex-col items-center justify-center gap-4 py-4 sm:flex-row sm:gap-24 sm:py-12">
        {/* Content Section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center gap-6">
              <Image
                alt={`${env.NEXT_PUBLIC_APPLICATION_NAME} Logo`}
                className="h-16 w-16 object-contain sm:h-20 sm:w-20"
                height={96}
                src="/images/splash.png"
                width={96}
              />
              <div className="flex flex-col">
                <h1 className="font-normal text-lg sm:text-2xl">
                  {env.NEXT_PUBLIC_APPLICATION_NAME}
                </h1>
                <p className="text-black/70 text-xs sm:text-base">
                  Built by{" "}
                  <a
                    className="text-black/90 underline transition-colors hover:text-black"
                    href="https://builders.garden"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Builders Garden
                  </a>{" "}
                  team
                </p>
              </div>
            </div>
            <p className="text-black/80 text-xs sm:text-lg">
              {env.NEXT_PUBLIC_APPLICATION_NAME}
            </p>
          </div>

          <div className="flex flex-row gap-0 sm:gap-4">
            <div className="flex flex-col gap-0 sm:gap-4">
              <div className="hidden w-fit rounded-xl border-2 border-black/20 bg-white p-2 backdrop-blur-sm sm:block">
                <QRCodeSVG className="w-fit rounded-sm" value={pageUrl} />
              </div>
            </div>

            <div className="flex w-full flex-col gap-4 sm:w-fit">
              <a
                className="flex w-full flex-row items-center justify-start gap-4 rounded-xl bg-[#8A63D2] p-4 text-white transition-transform hover:scale-105"
                href={pageUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <svg
                  className="h-10 w-10"
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

                <span className="font-medium text-xs sm:text-lg">
                  Play on Farcaster
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
