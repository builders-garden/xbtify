"use client";

import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    filler_words?: string[];
  };
  keywords?: Record<string, string>;
  tone?: string;
  syntax?: {
    sentence_length?: string;
    capitalization?: string;
    punctuation?: string;
    formatting?: string;
  };
  patterns_per_topic?: Record<string, string>;
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
  standalone?: boolean;
};

export function CommonPhrases({
  phrases,
  delay = 0.3,
  standalone = true,
}: CommonPhrasesProps) {
  if (!phrases || phrases.length === 0) {
    return null;
  }

  const content = (
    <>
      <h4 className="mb-2 font-semibold text-purple-300 text-sm">
        Common Phrases
      </h4>
      <div className="flex flex-wrap gap-2">
        {phrases.map((phrase) => (
          <span
            className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-purple-200 text-xs"
            key={phrase}
          >
            "{phrase}"
          </span>
        ))}
      </div>
    </>
  );

  if (!standalone) {
    return <div>{content}</div>;
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
        {phrases.map((phrase) => (
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
  standalone?: boolean;
};

export function Jargon({
  jargon,
  delay = 0.4,
  standalone = true,
}: JargonProps) {
  if (!jargon || jargon.length === 0) {
    return null;
  }

  const content = (
    <>
      <h4 className="mb-2 font-semibold text-purple-300 text-sm">
        Jargon & Slang
      </h4>
      <div className="flex flex-wrap gap-2">
        {jargon.map((word) => (
          <span
            className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-purple-200 text-xs"
            key={word}
          >
            {word}
          </span>
        ))}
      </div>
    </>
  );

  if (!standalone) {
    return <div>{content}</div>;
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
        {jargon.map((word) => (
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
  standalone?: boolean;
};

export function Topics({
  keywords,
  delay = 0.5,
  standalone = true,
}: TopicsProps) {
  if (!keywords || Object.keys(keywords).length === 0) {
    return null;
  }

  const content = (
    <div className="space-y-2">
      {Object.entries(keywords).map(([key, description]) => (
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
  );

  if (!standalone) {
    return content;
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
      {content}
    </motion.div>
  );
}

// Communication Style Component
type CommunicationStyleProps = {
  style: string;
  delay?: number;
  standalone?: boolean;
};

export function CommunicationStyle({
  style,
  delay = 0.6,
  standalone = true,
}: CommunicationStyleProps) {
  if (!style) {
    return null;
  }

  const content = (
    <p className="text-purple-200/80 text-sm leading-relaxed">{style}</p>
  );

  if (!standalone) {
    return content;
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
      {content}
    </motion.div>
  );
}

// Filler Words Component
type FillerWordsProps = {
  fillerWords: string[];
  delay?: number;
  standalone?: boolean;
};

export function FillerWords({
  fillerWords,
  delay = 0.4,
  standalone = true,
}: FillerWordsProps) {
  if (!fillerWords || fillerWords.length === 0) {
    return null;
  }

  const content = (
    <>
      <h4 className="mb-2 font-semibold text-purple-300 text-sm">
        Filler Words
      </h4>
      <div className="flex flex-wrap gap-2">
        {fillerWords.map((word) => (
          <span
            className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-purple-200 text-xs"
            key={word}
          >
            {word}
          </span>
        ))}
      </div>
    </>
  );

  if (!standalone) {
    return <div>{content}</div>;
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-purple-400/20 bg-gradient-to-br from-purple-500/5 via-purple-500/5 to-purple-600/5 p-4 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, delay }}
    >
      <h3 className="mb-3 font-bold text-lg text-white">Filler Words 🤔</h3>
      <div className="flex flex-wrap gap-2">
        {fillerWords.map((word) => (
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

// Syntax Patterns Component
type SyntaxPatternsProps = {
  syntax: {
    sentence_length?: string;
    capitalization?: string;
    punctuation?: string;
    formatting?: string;
  };
  delay?: number;
  standalone?: boolean;
};

export function SyntaxPatterns({
  syntax,
  delay = 0.7,
  standalone = true,
}: SyntaxPatternsProps) {
  if (!syntax || Object.keys(syntax).length === 0) {
    return null;
  }

  const content = (
    <div className="space-y-3">
      {syntax.sentence_length && (
        <div className="rounded-lg border border-purple-400/20 bg-purple-500/5 p-3">
          <h4 className="mb-1 font-semibold text-purple-300 text-sm">
            Sentence Length
          </h4>
          <p className="text-purple-200/70 text-xs">{syntax.sentence_length}</p>
        </div>
      )}
      {syntax.capitalization && (
        <div className="rounded-lg border border-purple-400/20 bg-purple-500/5 p-3">
          <h4 className="mb-1 font-semibold text-purple-300 text-sm">
            Capitalization
          </h4>
          <p className="text-purple-200/70 text-xs">{syntax.capitalization}</p>
        </div>
      )}
      {syntax.punctuation && (
        <div className="rounded-lg border border-purple-400/20 bg-purple-500/5 p-3">
          <h4 className="mb-1 font-semibold text-purple-300 text-sm">
            Punctuation
          </h4>
          <p className="text-purple-200/70 text-xs">{syntax.punctuation}</p>
        </div>
      )}
      {syntax.formatting && (
        <div className="rounded-lg border border-purple-400/20 bg-purple-500/5 p-3">
          <h4 className="mb-1 font-semibold text-purple-300 text-sm">
            Formatting
          </h4>
          <p className="text-purple-200/70 text-xs">{syntax.formatting}</p>
        </div>
      )}
    </div>
  );

  if (!standalone) {
    return content;
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-purple-400/20 bg-gradient-to-br from-purple-500/5 via-purple-500/5 to-purple-600/5 p-4 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, delay }}
    >
      <h3 className="mb-3 font-bold text-lg text-white">
        Syntax & Writing Patterns 📝
      </h3>
      {content}
    </motion.div>
  );
}

// Topic-Specific Patterns Component
type TopicPatternsProps = {
  patterns: Record<string, string>;
  delay?: number;
  standalone?: boolean;
};

export function TopicPatterns({
  patterns,
  delay = 0.8,
  standalone = true,
}: TopicPatternsProps) {
  if (!patterns || Object.keys(patterns).length === 0) {
    return null;
  }

  const content = (
    <div className="space-y-2">
      {Object.entries(patterns).map(([topic, description]) => (
        <div
          className="rounded-lg border border-purple-400/20 bg-purple-500/5 p-3"
          key={topic}
        >
          <h4 className="mb-1 font-semibold text-purple-300 text-sm capitalize">
            {topic.replace(/_/g, " ")}
          </h4>
          <p className="text-purple-200/70 text-xs">{description}</p>
        </div>
      ))}
    </div>
  );

  if (!standalone) {
    return content;
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-purple-400/20 bg-gradient-to-br from-purple-500/5 via-purple-500/5 to-purple-600/5 p-4 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, delay }}
    >
      <h3 className="mb-3 font-bold text-lg text-white">
        Topic-Specific Communication Patterns 🎭
      </h3>
      {content}
    </motion.div>
  );
}

// Comprehensive Style Profile Accordion Component
type StyleProfileAccordionProps = {
  styleProfile: StyleProfile;
  delay?: number;
};

export function StyleProfileAccordion({
  styleProfile,
  delay = 0.3,
}: StyleProfileAccordionProps) {
  const hasVocabulary =
    styleProfile?.vocabulary?.common_phrases ||
    styleProfile?.vocabulary?.jargon ||
    styleProfile?.vocabulary?.filler_words;
  const hasKeywords =
    styleProfile?.keywords && Object.keys(styleProfile.keywords).length > 0;
  const hasSyntax =
    styleProfile?.syntax && Object.keys(styleProfile.syntax).length > 0;
  const hasPatterns =
    styleProfile?.patterns_per_topic &&
    Object.keys(styleProfile.patterns_per_topic).length > 0;
  const hasTone = !!styleProfile?.tone;

  const hasAnyContent =
    hasVocabulary || hasKeywords || hasSyntax || hasPatterns || hasTone;

  if (!hasAnyContent) {
    return null;
  }

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-xl border border-purple-400/20 bg-gradient-to-br from-purple-500/5 via-purple-500/5 to-purple-600/5 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, delay }}
    >
      <div className="p-4 pb-0">
        <h3 className="mb-1 font-bold text-lg text-white">
          Communication Style Profile 📋
        </h3>
        <p className="mb-3 text-purple-200/60 text-xs">
          Detailed analysis of how this agent communicates
        </p>
      </div>

      <Accordion className="px-4 pb-4" collapsible type="single">
        {/* Vocabulary Section */}
        {hasVocabulary && (
          <AccordionItem className="border-purple-400/20" value="vocabulary">
            <AccordionTrigger className="cursor-pointer py-3 text-white hover:no-underline">
              <span className="font-semibold">💬 Vocabulary & Language</span>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pb-4">
              {styleProfile.vocabulary?.common_phrases && (
                <CommonPhrases
                  phrases={styleProfile.vocabulary.common_phrases}
                  standalone={false}
                />
              )}
              {styleProfile.vocabulary?.jargon && (
                <Jargon
                  jargon={styleProfile.vocabulary.jargon}
                  standalone={false}
                />
              )}
              {styleProfile.vocabulary?.filler_words && (
                <FillerWords
                  fillerWords={styleProfile.vocabulary.filler_words}
                  standalone={false}
                />
              )}
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Topics & Expertise */}
        {hasKeywords && (
          <AccordionItem className="border-purple-400/20" value="topics">
            <AccordionTrigger className="cursor-pointer py-3 text-white hover:no-underline">
              <span className="font-semibold">🎯 Topics & Expertise</span>
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <Topics
                keywords={styleProfile.keywords || {}}
                standalone={false}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Tone */}
        {hasTone && (
          <AccordionItem className="border-purple-400/20" value="tone">
            <AccordionTrigger className="cursor-pointer py-3 text-white hover:no-underline">
              <span className="font-semibold">✨ Communication Tone</span>
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <CommunicationStyle
                standalone={false}
                style={styleProfile.tone || ""}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Syntax Patterns */}
        {hasSyntax && (
          <AccordionItem className="border-purple-400/20" value="syntax">
            <AccordionTrigger className="cursor-pointer py-3 text-white hover:no-underline">
              <span className="font-semibold">📝 Writing Patterns</span>
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <SyntaxPatterns
                standalone={false}
                syntax={styleProfile.syntax || {}}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Topic-Specific Patterns */}
        {hasPatterns && (
          <AccordionItem className="border-purple-400/20" value="patterns">
            <AccordionTrigger className="cursor-pointer py-3 text-white hover:no-underline">
              <span className="font-semibold">
                🎭 Topic-Specific Communication
              </span>
            </AccordionTrigger>
            <AccordionContent className="pb-3">
              <TopicPatterns
                patterns={styleProfile.patterns_per_topic || {}}
                standalone={false}
              />
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </motion.div>
  );
}
