import { sdk as miniappSdk } from "@farcaster/miniapp-sdk";
import { env } from "@/lib/env";

/**
 * Share an agent profile on Farcaster using composeCast
 * @param agentId - The database ID of the agent
 * @param agentUsername - The Farcaster username of the agent
 * @param creatorUsername - The Farcaster username of the creator (optional)
 */
export async function shareAgent(
  agentId: string,
  agentUsername: string,
  creatorUsername?: string
) {
  try {
    const appUrl = env.NEXT_PUBLIC_URL;
    const agentUrl = `${appUrl}/agent/${agentId}`;

    // Construct the cast text
    const creatorMention = creatorUsername ? " or tagging me" : "";
    const castText = `check out @${agentUsername}, my AI twin - try it by tagging it${creatorMention} on farcaster!`;
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
