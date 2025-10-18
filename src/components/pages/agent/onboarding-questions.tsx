"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type AnswerOption = {
  text: string;
  emoji: string;
  icon: string;
};

type Question = {
  id: string;
  question: string;
  answers: AnswerOption[];
};

const QUESTIONS: Question[] = [
  {
    id: "personality",
    question: "Choose your vibe 🔉",
    answers: [
      { text: "Builder", emoji: "👷", icon: "🔨" },
      { text: "Artist", emoji: "🎨", icon: "🖼️" },
      { text: "Business", emoji: "💼", icon: "📊" },
      { text: "Degen", emoji: "🎲", icon: "🚀" },
    ],
  },
  {
    id: "tone",
    question: "Pick your talking style 🗣️",
    answers: [
      { text: "Formal", emoji: "🎩", icon: "📝" },
      { text: "Enthusiastic", emoji: "🔥", icon: "⚡" },
      { text: "Irreverent", emoji: "😎", icon: "🤘" },
      { text: "Humorous", emoji: "😂", icon: "🎭" },
    ],
  },
  {
    id: "character",
    question: "If your agent was a character in a movie, who would they be?",
    answers: [
      { text: "Mastermind", emoji: "🧠", icon: "👑" },
      { text: "Buddy", emoji: "🤝", icon: "⭐" },
      { text: "Comic Relief", emoji: "🤡", icon: "🎪" },
      { text: "Villain", emoji: "😈", icon: "💜" },
    ],
  },
];

const CELEBRATION_MESSAGES = ["lesssgoooo 🥀", "based broder 🚬", "yayyy 💨"];

type OnboardingQuestionsProps = {
  onComplete: (answers: Record<string, string>) => void;
};

export function OnboardingQuestions({ onComplete }: OnboardingQuestionsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState("");
  const [currentIconIndex, setCurrentIconIndex] = useState(0);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1;

  // Rotate through icons
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIconIndex(
        (prev) => (prev + 1) % currentQuestion.answers.length
      );
    }, 1500);
    return () => clearInterval(interval);
  }, [currentQuestion.answers.length]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);

    // Show celebration message in order
    setCelebrationMessage(CELEBRATION_MESSAGES[currentQuestionIndex]);
    setShowCelebration(true);

    // Wait a bit for the animation, then proceed
    setTimeout(() => {
      const newAnswers = {
        ...answers,
        [currentQuestion.id]: answer,
      };
      setAnswers(newAnswers);

      if (isLastQuestion) {
        // Complete the onboarding
        onComplete(newAnswers);
      } else {
        // Move to next question
        setShowCelebration(false);
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setCurrentIconIndex(0);
      }
    }, 1500);
  };

  const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden">
      {/* Content */}
      <div className="relative z-50 flex h-full w-full flex-col">
        {/* Top Section - Fixed Question */}
        <div className="flex-shrink-0 px-6 pt-8 pb-4">
          <div className="mx-auto w-full max-w-2xl">
            {/* Progress Bar */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
              initial={{ opacity: 0, y: -20 }}
            >
              <div className="mb-3 flex justify-between text-indigo-300 text-sm">
                <span>
                  Question {currentQuestionIndex + 1} of {QUESTIONS.length}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-600"
                  initial={{ width: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </motion.div>

            {/* Question Text */}
            <AnimatePresence mode="wait">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
                exit={{ opacity: 0, y: -20 }}
                initial={{ opacity: 0, y: 20 }}
                key={currentQuestion.id}
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-bold text-2xl text-white">
                  {currentQuestion.question}
                </h2>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Middle Section - Rotating Icons */}
        <div className="relative flex flex-1 items-center justify-center px-6">
          <AnimatePresence mode="wait">
            {showCelebration ? (
              <motion.div
                animate={{ scale: 1, opacity: 1 }}
                className="relative text-center"
                exit={{ opacity: 0 }}
                initial={{ scale: 0.8, opacity: 0 }}
                key="celebration"
                transition={{ duration: 0.3 }}
              >
                {/* Pulsing glow */}
                <motion.div
                  animate={{
                    scale: [1, 2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/40 via-amber-500/40 to-orange-500/40 blur-3xl"
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />

                {/* Celebration text */}
                <motion.p
                  animate={{
                    y: [0, -10, 0],
                    scale: [1, 1.15, 1],
                  }}
                  className="relative z-10 font-bold text-4xl text-white"
                  style={{
                    filter: "drop-shadow(0 0 20px rgba(251, 191, 36, 0.8))",
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  {celebrationMessage}
                </motion.p>
              </motion.div>
            ) : (
              <motion.div
                animate={{ opacity: 1 }}
                className="relative flex h-72 w-72 items-center justify-center"
                exit={{ opacity: 0 }}
                initial={{ opacity: 1 }}
                key={`icon-${currentIconIndex}-${currentQuestion.id}`}
                transition={{ duration: 0.3 }}
              >
                {/* Golden aura - outer ring */}
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3],
                    rotate: [0, 360],
                  }}
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/30 via-amber-500/30 to-orange-500/30 blur-3xl"
                  transition={{
                    scale: {
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    },
                    opacity: {
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    },
                    rotate: {
                      duration: 20,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    },
                  }}
                />

                {/* Purple glow - inner ring */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.7, 0.4],
                    rotate: [360, 0],
                  }}
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/40 to-indigo-600/40 blur-3xl"
                  transition={{
                    scale: {
                      duration: 2.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    },
                    opacity: {
                      duration: 2.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    },
                    rotate: {
                      duration: 15,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    },
                  }}
                />

                {/* Icon with floating animation */}
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  className="relative text-[11rem] leading-none drop-shadow-2xl"
                  style={{
                    filter: "drop-shadow(0 0 30px rgba(251, 191, 36, 0.5))",
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  {currentQuestion.answers[currentIconIndex].emoji}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Section - Fixed Answer Buttons */}
        <div className="flex-shrink-0 px-6 pb-8">
          <div className="mx-auto w-full max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-3"
                exit={{ opacity: 0, y: 20 }}
                initial={{ opacity: 0, y: 20 }}
                key={currentQuestion.id}
                transition={{ duration: 0.3 }}
              >
                {currentQuestion.answers.map((answer, index) => {
                  const isSelected = selectedAnswer === answer.text;
                  return (
                    <motion.div
                      animate={{ opacity: 1, scale: 1 }}
                      initial={{ opacity: 0, scale: 0.9 }}
                      key={answer.text}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Button
                        className={`group relative flex h-20 w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl border-2 bg-white/5 font-semibold text-base backdrop-blur-sm transition-all hover:scale-105 hover:cursor-pointer hover:text-white active:scale-95 ${
                          isSelected
                            ? "border-purple-500 bg-gradient-to-r from-purple-500/20 to-indigo-600/20 text-white"
                            : "border-white/20 text-white hover:border-white/40 hover:bg-white/10"
                        }`}
                        disabled={selectedAnswer !== null}
                        onClick={() => handleAnswerSelect(answer.text)}
                        variant="outline"
                      >
                        {/* Emoji */}
                        <span className="relative z-10 text-2xl">
                          {answer.emoji}
                        </span>

                        {/* Answer text */}
                        <span className="relative z-10 text-sm">
                          {answer.text}
                        </span>

                        {/* Selected indicator */}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              animate={{
                                scale: [0, 1.2, 1],
                                rotate: [0, 180, 360],
                              }}
                              className="absolute top-2 right-2"
                              exit={{ scale: 0 }}
                              initial={{ scale: 0 }}
                              transition={{ duration: 0.5 }}
                            >
                              <span className="text-xl">✨</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Button>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
