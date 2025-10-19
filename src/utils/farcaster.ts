import type {
  ImpactOccurredType,
  NotificationOccurredType,
} from "@farcaster/miniapp-core/dist/actions/Haptics";
import type { MiniAppContext } from "@farcaster/miniapp-core/dist/context";
import miniappSdk, { type MiniAppHostCapability } from "@farcaster/miniapp-sdk";
import { env } from "@/lib/env";

/**
 * Create a cast intent url to open outside of farcaster mini app
 * @param text - The text of the cast
 * @param miniappUrl - The url of the mini app
 * @returns The cast intent url
 */
export const createFarcasterIntentUrl = async (
  text: string,
  miniappUrl: string,
  channelKey?: string
) => {
  try {
    const result = await miniappSdk.actions.composeCast({
      text,
      embeds: [miniappUrl],
      channelKey,
    });
    return result.cast?.hash;
  } catch (error) {
    console.error(
      "Failed to create farcaster intent url, falling back to open legacy url",
      error
    );
    const finalURL = `https://farcaster.xyz/~/compose?text=${encodeURIComponent(
      text
    )}&embeds[]=${encodeURIComponent(miniappUrl)}${
      channelKey ? `&channelKey=${channelKey}` : ""
    }`;
    if (window !== undefined) {
      window.open(finalURL, "_blank");
    }
  }
};

/**
 * Opens the Farcaster profile of a specific user
 * @param farcasterFid - The Farcaster FID of the user
 */
export const openFarcasterProfile = (farcasterFid: number) => {
  if (farcasterFid) {
    miniappSdk.actions.viewProfile({
      fid: farcasterFid,
    });
  }
};

/**
 * Trigger a haptic feedback on farcaster mobile
 * @param context - The context of the mini app
 * @param capabilities - The capabilities of the mini app
 * @param hapticType - The type of haptic feedback
 * @param hapticStyle - The style of haptic feedback
 */
export const triggerHaptics = (
  context: MiniAppContext | null,
  capabilities: MiniAppHostCapability[] | null,
  hapticType:
    | "haptics.impactOccurred"
    | "haptics.notificationOccurred"
    | "haptics.selectionChanged",
  hapticStyle: ImpactOccurredType | NotificationOccurredType | "selection"
) => {
  if (context && capabilities && capabilities.includes(hapticType)) {
    if (hapticType === "haptics.impactOccurred") {
      miniappSdk.haptics.impactOccurred(hapticStyle as ImpactOccurredType);
    } else if (hapticType === "haptics.notificationOccurred") {
      miniappSdk.haptics.notificationOccurred(
        hapticStyle as NotificationOccurredType
      );
    } else if (hapticType === "haptics.selectionChanged") {
      miniappSdk.haptics.selectionChanged();
    }
  }
};

/**
 * Get the farcaster manifest for the mini app, generate yours from Warpcast Mobile
 *  On your phone to Settings > Developer > Domains > insert website hostname > Generate domain manifest
 *
 * @returns The farcaster manifest for the mini app
 * @schema https://github.com/farcasterxyz/miniapps/blob/main/packages/miniapp-core/src/schemas/manifest.ts
 * @documentation https://miniapps.farcaster.xyz/docs/guides/publishing#define-your-application-configuration
 */
export function getFarcasterManifest() {
  let miniappName = env.NEXT_PUBLIC_APPLICATION_NAME;
  let noindex = true;
  const appUrl = env.NEXT_PUBLIC_URL;
  if (appUrl === "https://xbtify.me") {
    noindex = false;
  } else if (appUrl === "https://dev.production-url.com") {
    miniappName += " Dev";
  } else if (appUrl.includes("ngrok") || appUrl.includes("tunnel")) {
    miniappName += " Local";
  }
  return {
    accountAssociation: {
      header: env.NEXT_PUBLIC_FARCASTER_HEADER,
      payload: env.NEXT_PUBLIC_FARCASTER_PAYLOAD,
      signature: env.NEXT_PUBLIC_FARCASTER_SIGNATURE,
    },
    baseBuilder: {
      allowedAddresses: [env.NEXT_PUBLIC_BASE_BUILDER_ADDRESS],
    },
    miniapp: {
      version: "1",
      name: miniappName,
      iconUrl: `${appUrl}/images/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/images/feed.png`,
      buttonTitle: "Create your AI twin",
      splashImageUrl: `${appUrl}/images/icon.png`,
      splashBackgroundColor: "#000000",
      webhookUrl: `${appUrl}/api/webhook/farcaster`, // our farcaster webhook
      // Metadata https://github.com/farcasterxyz/miniapps/discussions/191
      subtitle: "Meet your AI twin on Farcaster", // 30 characters, no emojis or special characters, short description under app name
      description:
        "Create your AI agent that engages with your Farcaster community up all day. Customize personality, tone, and communication style to perfectly match your voice", // 170 characters, no emojis or special characters, promotional message displayed on Mini App Page
      primaryCategory: "social", // https://github.com/farcasterxyz/miniapps/blob/main/packages/miniapp-core/src/schemas/manifest.ts
      tags: ["ai", "agent", "automation", "social", "assistant"], // up to 5 tags, filtering/search tags
      tagline: "Scale yourself with AI", // 30 characters, marketing tagline should be punchy and descriptive
      ogTitle: `${miniappName} - AI Agent`, // 30 characters, app name + short tag, Title case, no emojis
      ogDescription:
        "Create your AI twin that engages on Farcaster up all day. Make it yours", // 100 characters, summarize core benefits in 1-2 lines
      screenshotUrls: [
        // 1284 x 2778, visual previews of the app, max 3 screenshots
        `${appUrl}/images/feed.png`,
      ],
      heroImageUrl: `${appUrl}/images/feed.png`, // 1200 x 630px (1.91:1), promotional display image on top of the mini app store
      ogImageUrl: `${appUrl}/images/feed.png`, // 1200 x 630px (1.91:1), promotional image, same as app hero image
      noindex,
      requiredChains: ["eip155:1", "eip155:8453"],
      requiredCapabilities: ["wallet.getEthereumProvider"],
    },
  };
}
