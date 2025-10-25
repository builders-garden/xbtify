/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import { ImageResponse } from "next/og";
import { FARCASTER_EMBED_SIZE } from "@/lib/constants";
import { getAgentByCreatorFid } from "@/lib/database/queries/agent.query";
import { env } from "@/lib/env";
import { getFonts } from "@/utils/og-image";

// Force dynamic rendering to ensure fresh image generation on each request
export const dynamic = "force-dynamic";

/**
 * GET handler for generating dynamic OpenGraph images for agents
 * @param request - The incoming HTTP request
 * @param params - Route parameters containing the creator FID
 * @returns ImageResponse - A dynamically generated image for OpenGraph
 */
export async function GET(
  _: Request,
  {
    params,
  }: {
    params: Promise<{
      creatorFid: string;
    }>;
  }
) {
  try {
    // Extract the creator FID from the route parameters
    const { creatorFid } = await params;

    if (!creatorFid) {
      return new Response("Creator FID is required", { status: 400 });
    }

    // Get the agent from the database
    const agent = await getAgentByCreatorFid(Number.parseInt(creatorFid, 10));

    if (!agent) {
      return new Response("Agent not found", { status: 404 });
    }

    // Load fonts
    const fonts = await getFonts();

    // Load Jersey25 font for display name
    const displayText = agent.displayName || agent.username || "";
    const jersey25FontUrl = `https://fonts.googleapis.com/css2?family=Jersey+25&text=${encodeURIComponent(displayText)}`;
    const jersey25Css = await fetch(jersey25FontUrl).then((res) => res.text());
    const fontUrlMatch = jersey25Css.match(
      // biome-ignore lint/performance/useTopLevelRegex: regex used in async context
      /src: url\((.+)\) format\('(opentype|truetype)'\)/
    );

    if (fontUrlMatch) {
      const jersey25Data = await fetch(fontUrlMatch[1]).then((res) =>
        res.arrayBuffer()
      );
      fonts.push({
        name: "Jersey25",
        data: jersey25Data,
        weight: 400,
        style: "normal",
      });
    }

    // Use 3:2 aspect ratio (Farcaster embed size)
    const width = FARCASTER_EMBED_SIZE.width;
    const height = FARCASTER_EMBED_SIZE.height;

    // Parse style profile for jargon & slang and filler words
    const styleProfile = agent.styleProfilePrompt
      ? parseStyleProfile(agent.styleProfilePrompt)
      : null;

    const jargonWords = styleProfile?.jargonSlang || [];
    const fillerWords = styleProfile?.fillerWords || [];
    const backgroundWords = [...jargonWords, ...fillerWords];

    // Generate random positions for background words
    const getRandomPosition = (index: number) => {
      // Use deterministic positioning based on index for consistency
      const positions = [
        { top: "8%", left: "5%", rotate: -12 },
        { top: "15%", right: "8%", rotate: 8 },
        { top: "75%", left: "10%", rotate: -8 },
        { top: "82%", right: "12%", rotate: 15 },
        { top: "25%", left: "15%", rotate: -5 },
        { top: "65%", right: "15%", rotate: 10 },
        { top: "45%", left: "5%", rotate: -15 },
        { top: "55%", right: "5%", rotate: 12 },
      ];
      return positions[index % positions.length];
    };

    // Load the background image
    const appUrl = env.NEXT_PUBLIC_URL;
    const bgImageUrl = `${appUrl}/images/og-bg.png`;

    // Generate and return the image response
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          backgroundImage: `url(${bgImageUrl})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        tw="flex flex-col items-center justify-center w-full h-full relative overflow-hidden"
      >
        {/* Background words with low opacity */}
        {backgroundWords.slice(0, 8).map((word, index) => {
          const pos = getRandomPosition(index);
          const { rotate, ...position } = pos;
          return (
            <div
              key={`${word}-${
                // biome-ignore lint/suspicious/noArrayIndexKey: This is a static array
                index
              }`}
              style={{
                ...position,
                opacity: 0.08,
                color: "#ffffff",
                transform: `rotate(${rotate}deg)`,
              }}
              tw="absolute text-6xl font-bold"
            >
              {word}
            </div>
          );
        })}

        {/* Main content container */}
        <div
          style={{ display: "flex", gap: "40px", padding: "80px", zIndex: 1 }}
          tw="flex flex-col items-center justify-center relative"
        >
          {/* Agent Avatar */}
          {agent.avatarUrl && (
            // biome-ignore lint/performance/noImgElement: OG image generation requires img element
            <img
              alt="avatar"
              height={200}
              src={agent.avatarUrl}
              style={{
                border: "6px solid rgba(168, 85, 247, 0.3)",
                boxShadow: "0 20px 60px rgba(168, 85, 247, 0.3)",
              }}
              tw="rounded-full"
              width={200}
            />
          )}

          {/* Agent name and username */}
          <div
            style={{ display: "flex", gap: "12px" }}
            tw="flex flex-col items-center"
          >
            <span
              style={{
                color: "#ffffff",
                textShadow: "0 4px 12px rgba(0,0,0,0.4)",
                fontFamily: "Jersey25, Inter",
              }}
              tw="text-6xl font-black text-center"
            >
              {agent.displayName || agent.username}
            </span>
            <span
              style={{
                color: "#e0e0e0",
                textShadow: "0 2px 8px rgba(0,0,0,0.3)",
              }}
              tw="text-4xl text-center"
            >
              @{agent.username}
            </span>
          </div>

          {/* Personality traits */}
          <div
            style={{ display: "flex", gap: "20px", maxWidth: "1000px" }}
            tw="flex flex-wrap justify-center"
          >
            {agent.personality && (
              <div
                style={{
                  padding: "16px 32px",
                  borderRadius: "28px",
                  background: "rgba(168, 85, 247, 0.9)",
                  border: "3px solid rgba(168, 85, 247, 1)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
                tw="text-3xl text-white font-bold"
              >
                {agent.personality}
              </div>
            )}
            {agent.tone && (
              <div
                style={{
                  padding: "16px 32px",
                  borderRadius: "28px",
                  background: "rgba(236, 72, 153, 0.9)",
                  border: "3px solid rgba(236, 72, 153, 1)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
                tw="text-3xl text-white font-bold"
              >
                {agent.tone}
              </div>
            )}
            {agent.movieCharacter && (
              <div
                style={{
                  padding: "16px 32px",
                  borderRadius: "28px",
                  background: "rgba(147, 51, 234, 0.9)",
                  border: "3px solid rgba(147, 51, 234, 1)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
                tw="text-3xl text-white font-bold"
              >
                {agent.movieCharacter}
              </div>
            )}
          </div>
        </div>
      </div>,
      {
        width,
        height,
        fonts,
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59",
        },
      }
    );
  } catch (e) {
    // Log and handle any errors during image generation
    console.error("Failed to generate agent image", e);
    return new Response("Failed to generate agent image", {
      status: 500,
    });
  }
}

// Regex patterns at top level for performance
const JARGON_REGEX = /Jargon & Slang:\s*([^\n]+)/i;
const FILLER_REGEX = /Filler Words:\s*([^\n]+)/i;

/**
 * Parse style profile from prompt string
 */
function parseStyleProfile(prompt: string): {
  jargonSlang: string[];
  fillerWords: string[];
} | null {
  try {
    // Try to extract jargon/slang and filler words from the prompt
    const jargonMatch = prompt.match(JARGON_REGEX);
    const fillerMatch = prompt.match(FILLER_REGEX);

    const jargonSlang = jargonMatch
      ? jargonMatch[1]
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const fillerWords = fillerMatch
      ? fillerMatch[1]
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    return {
      jargonSlang,
      fillerWords,
    };
  } catch {
    return null;
  }
}
