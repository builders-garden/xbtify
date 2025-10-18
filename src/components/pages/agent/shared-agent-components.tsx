"use client";

import { motion } from "motion/react";

// Personality options with emojis
export const PERSONALITY_OPTIONS = {
  builder: { label: "Builder", emoji: "👷" },
  artist: { label: "Artist", emoji: "🎨" },
  business: { label: "Business", emoji: "💼" },
  degen: { label: "Degen", emoji: "🎲" },
} as const;

export const TONE_OPTIONS = {
  formal: { label: "Formal", emoji: "🎩" },
  enthusiastic: { label: "Enthusiastic", emoji: "🔥" },
  irreverent: { label: "Irreverent", emoji: "😎" },
  humorous: { label: "Humorous", emoji: "😂" },
} as const;

export const CHARACTER_OPTIONS = {
  mastermind: { label: "Mastermind", emoji: "🧠" },
  buddy: { label: "Buddy", emoji: "🤝" },
  "comic relief": { label: "Comic Relief", emoji: "🤡" },
  villain: { label: "Villain", emoji: "😈" },
} as const;

// Shared style profile type
export type StyleProfile = {
  vocabulary?: {
    common_phrases?: string[];
    jargon?: string[];
  };
  keywords?: Record<string, string>;
  tone?: string;
};

// Helper to parse style profile JSON
export function parseStyleProfile(
  styleProfilePrompt: string | null | undefined
): StyleProfile | null {
  if (!styleProfilePrompt) {
    return null;
  }
  try {
    return JSON.parse(styleProfilePrompt);
  } catch {
    return null;
  }
}

// Personality Traits Component
type PersonalityTraitsProps = {
  personality?: string | null;
  tone?: string | null;
  movieCharacter?: string | null;
  delay?: number;
};

export function PersonalityTraits({
  personality,
  tone,
  movieCharacter,
  delay = 0.2,
}: PersonalityTraitsProps) {
  const hasAnyTrait = Boolean(personality || tone || movieCharacter);

  if (!hasAnyTrait) {
    return null;
  }

  const getPersonalityDisplay = (value: string) => {
    const option =
      PERSONALITY_OPTIONS[value as keyof typeof PERSONALITY_OPTIONS];
    return option ? `${option.emoji} ${option.label}` : value;
  };

  const getToneDisplay = (value: string) => {
    const option = TONE_OPTIONS[value as keyof typeof TONE_OPTIONS];
    return option ? `${option.emoji} ${option.label}` : value;
  };

  const getCharacterDisplay = (value: string) => {
    const option = CHARACTER_OPTIONS[value as keyof typeof CHARACTER_OPTIONS];
    return option ? `${option.emoji} ${option.label}` : value;
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-purple-400/20 bg-gradient-to-br from-purple-500/5 via-purple-500/5 to-purple-600/5 p-4 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, delay }}
    >
      <div className="mb-3">
        <h3 className="font-bold text-lg text-white">Personality Traits</h3>
      </div>

      <div className="flex flex-wrap gap-3">
        {personality && (
          <div className="flex flex-col gap-1">
            <p className="text-purple-200/60 text-xs">Personality</p>
            <span className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-purple-200 text-sm">
              {getPersonalityDisplay(personality)}
            </span>
          </div>
        )}
        {tone && (
          <div className="flex flex-col gap-1">
            <p className="text-purple-200/60 text-xs">Tone</p>
            <span className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-purple-200 text-sm">
              {getToneDisplay(tone)}
            </span>
          </div>
        )}
        {movieCharacter && (
          <div className="flex flex-col gap-1">
            <p className="text-purple-200/60 text-xs">Character</p>
            <span className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-purple-200 text-sm">
              {getCharacterDisplay(movieCharacter)}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Common Phrases Component
type CommonPhrasesProps = {
  phrases: string[];
  delay?: number;
};

export function CommonPhrases({ phrases, delay = 0.3 }: CommonPhrasesProps) {
  if (!phrases || phrases.length === 0) {
    return null;
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-purple-400/20 bg-gradient-to-br from-purple-500/5 via-purple-500/5 to-purple-600/5 p-4 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, delay }}
    >
      <h3 className="mb-3 font-bold text-lg text-white">Common Phrases 💬</h3>
      <div className="flex flex-wrap gap-2">
        {phrases.slice(0, 8).map((phrase) => (
          <span
            className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-purple-200 text-sm"
            key={phrase}
          >
            "{phrase}"
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// Jargon Component
type JargonProps = {
  jargon: string[];
  delay?: number;
};

export function Jargon({ jargon, delay = 0.4 }: JargonProps) {
  if (!jargon || jargon.length === 0) {
    return null;
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-purple-400/20 bg-gradient-to-br from-purple-500/5 via-purple-500/5 to-purple-600/5 p-4 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, delay }}
    >
      <h3 className="mb-3 font-bold text-lg text-white">
        Vocabulary & Jargon 🗣️
      </h3>
      <div className="flex flex-wrap gap-2">
        {jargon.slice(0, 15).map((word) => (
          <span
            className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-purple-200 text-sm"
            key={word}
          >
            {word}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// Topics & Keywords Component
type TopicsProps = {
  keywords: Record<string, string>;
  delay?: number;
};

export function Topics({ keywords, delay = 0.5 }: TopicsProps) {
  if (!keywords || Object.keys(keywords).length === 0) {
    return null;
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-purple-400/20 bg-gradient-to-br from-purple-500/5 via-purple-500/5 to-purple-600/5 p-4 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, delay }}
    >
      <h3 className="mb-3 font-bold text-lg text-white">
        Topics & Expertise 🎯
      </h3>
      <div className="space-y-2">
        {Object.entries(keywords)
          .slice(0, 5)
          .map(([key, description]) => (
            <div
              className="rounded-lg border border-purple-400/20 bg-purple-500/5 p-3"
              key={key}
            >
              <h4 className="mb-1 font-semibold text-purple-300 text-sm capitalize">
                {key.replace(/_/g, " ")}
              </h4>
              <p className="text-purple-200/70 text-xs">{description}</p>
            </div>
          ))}
      </div>
    </motion.div>
  );
}

// Communication Style Component
type CommunicationStyleProps = {
  style: string;
  delay?: number;
};

export function CommunicationStyle({
  style,
  delay = 0.6,
}: CommunicationStyleProps) {
  if (!style) {
    return null;
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-purple-400/20 bg-gradient-to-br from-purple-500/5 via-purple-500/5 to-purple-600/5 p-4 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, delay }}
    >
      <h3 className="mb-2 font-bold text-lg text-white">
        Communication Style ✨
      </h3>
      <p className="text-purple-200/80 text-sm leading-relaxed">{style}</p>
    </motion.div>
  );
}
