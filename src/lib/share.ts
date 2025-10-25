import { sdk as miniappSdk } from "@farcaster/miniapp-sdk";
import { env } from "@/lib/env";

/**
 * Share an agent profile on Farcaster using composeCast
 * @param creatorFid - The FID of the agent creator
 * @param agentUsername - The Farcaster username of the agent
 * @param creatorUsername - The Farcaster username of the creator (optional)
 * @param isOwner - Whether the person sharing is the agent owner (default: false)
 */
export async function shareAgent(
  creatorFid: string,
  agentUsername: string,
  creatorUsername?: string,
  isOwner = false
) {
  try {
    const appUrl = env.NEXT_PUBLIC_URL;
    const agentUrl = `${appUrl}/agent/${creatorFid}`;

    // Construct the cast text
    const agentDescription = isOwner ? ", my AI twin" : "";
    const creatorMention = creatorUsername ? " or tagging me" : "";
    const castText = `check out @${agentUsername}${agentDescription} - try it by tagging it${creatorMention} on farcaster!`;
    // Open the compose cast dialog with pre-filled content
    await miniappSdk.actions.composeCast({
      text: castText,
      embeds: [agentUrl],
    });

    return { success: true };
  } catch (error) {
    console.error("Error sharing agent:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to share agent",
    };
  }
}
