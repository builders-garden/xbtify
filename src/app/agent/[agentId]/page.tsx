import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AgentPageContent } from "@/components/pages/agent/agent-page-content";
import { getAgentById } from "@/lib/database/queries/agent.query";
import { env } from "@/lib/env";
import { fetchUserFromNeynar } from "@/lib/neynar";

const appUrl = env.NEXT_PUBLIC_URL;
const appName = env.NEXT_PUBLIC_APPLICATION_NAME;

type Props = {
  params: Promise<{
    agentId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { agentId } = await params;

  // Get the agent from the database
  const agent = await getAgentById(agentId);

  // If there is no agent, return a default metadata
  if (!agent) {
    return {
      title: `Agent Not Found - ${appName}`,
      description: "The requested agent could not be found.",
    };
  }

  // Fetch Neynar data for bio
  const neynarUser = await fetchUserFromNeynar(agent.fid.toString());
  const bio =
    neynarUser?.profile?.bio?.text || "An AI agent vibing on Farcaster";

  const imageUrl = new URL(`${appUrl}/api/og/agent/${agentId}`);
  const agentUrl = `${appUrl}/agent/${agentId}`;

  const miniapp = {
    version: "next",
    imageUrl: imageUrl.toString(),
    button: {
      title: "View Agent",
      action: {
        type: "launch_miniapp",
        name: appName,
        url: agentUrl,
        splashImageUrl: `${appUrl}/images/splash.png`,
        splashBackgroundColor: "#ffffff",
      },
    },
  };

  return {
    title: `${agent.displayName || agent.username} - ${appName}`,
    description: bio,
    metadataBase: new URL(appUrl),
    openGraph: {
      title: `${agent.displayName || agent.username}`,
      description: bio,
      type: "website",
      images: [
        {
          url: imageUrl.toString(),
          width: 1500,
          height: 1000,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${agent.displayName || agent.username}`,
      description: bio,
      siteId: "1727435024931094528",
      creator: "@builders_garden",
      creatorId: "1727435024931094528",
      images: [imageUrl.toString()],
    },
    other: {
      "fc:miniapp": JSON.stringify(miniapp),
    },
  };
}

export default async function AgentPage({ params }: Props) {
  const { agentId } = await params;

  // Get the agent from the database
  const agent = await getAgentById(agentId);

  if (!agent) {
    notFound();
  }

  // Fetch Neynar data for bio
  const neynarUser = await fetchUserFromNeynar(agent.fid.toString());

  // Convert to MarketplaceAgent format
  const marketplaceAgent = {
    id: agent.id,
    username: agent.username || "unknown",
    displayName: agent.displayName || agent.username || "Agent",
    bio: neynarUser?.profile?.bio?.text || "An AI agent vibing on Farcaster",
    avatarUrl: agent.avatarUrl || undefined,
    messageCount: 0,
    followerCount: neynarUser?.follower_count || 0,
    externalUrl: agent.username
      ? `https://warpcast.com/${agent.username}`
      : "https://warpcast.com",
    personality: agent.personality || undefined,
    tone: agent.tone || undefined,
    movieCharacter: agent.movieCharacter || undefined,
    styleProfilePrompt: agent.styleProfilePrompt || undefined,
    address: agent.address || undefined,
  };

  return <AgentPageContent agent={marketplaceAgent} />;
}
