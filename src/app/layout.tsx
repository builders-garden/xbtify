import type { Metadata } from "next";
import { Gabarito, Jersey_25 } from "next/font/google";
import { headers } from "next/headers";
import { Suspense } from "react";
import { preconnect } from "react-dom";
import Providers from "@/components/providers";
import { VideoBackground } from "@/components/shared/video-background";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { env } from "@/lib/env";

export const gabarito = Gabarito({ subsets: ["latin"] });
export const jersey25 = Jersey_25({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-jersey",
});

export const metadata: Metadata = {
  title: `${env.NEXT_PUBLIC_APPLICATION_NAME} by Builders Garden`,
  description: `${env.NEXT_PUBLIC_APPLICATION_DESCRIPTION} by Builders Garden`,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  preconnect("https://auth.farcaster.xyz");
  const cookie = (await headers()).get("cookie");

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${gabarito.className} ${jersey25.variable} size-full antialiased`}
      >
        <VideoBackground />
        <Providers cookie={cookie}>
          {children}
          <Suspense>
            <Toaster />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
