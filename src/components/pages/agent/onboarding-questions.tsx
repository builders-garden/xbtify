"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type Question = {
  id: string;
  question: string;
  answers: string[];
};

const QUESTIONS: Question[] = [
  {
    id: "personality",
    question: "What's your vibe?",
    answers: ["Builder", "Artist", "Business", "Degen"],
  },
  {
    id: "tone",
    question: "Pick your communication style",
    answers: ["Formal", "Enthusiastic", "Irreverent", "Humorous"],
  },
  {
    id: "character",
    question: "If your agent was a character in a movie, who would they be?",
    answers: [
      "The Mastermind",
      "The Cool Sidekick",
      "The Comic Relief",
      "The Villain Everyone Loves",
    ],
  },
];

type OnboardingQuestionsProps = {
  onComplete: (answers: Record<string, string>) => void;
};

export function OnboardingQuestions({ onComplete }: OnboardingQuestionsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1;

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);

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
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
      }
    }, 500);
  };

  const progress = (currentQuestionIndex / QUESTIONS.length) * 100;

  return (
    <div className="relative flex min-h-screen w-full items-start justify-center overflow-hidden p-6">
      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Progress Bar */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
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

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
            exit={{ opacity: 0, x: -50 }}
            initial={{ opacity: 0, x: 50 }}
            key={currentQuestion.id}
            transition={{ duration: 0.3 }}
          >
            {/* Question Text */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="mb-4 font-bold text-white text-xl">
                {currentQuestion.question}
              </h2>
              <p className="text-indigo-200 text-lg">
                Choose the option that best describes you
              </p>
            </motion.div>

            {/* Answer Buttons */}
            <motion.div
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
            >
              {currentQuestion.answers.map((answer, index) => {
                const isSelected = selectedAnswer === answer;
                return (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 20 }}
                    key={answer}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Button
                      className={`group relative h-24 w-full overflow-hidden rounded-2xl border-2 bg-white/5 font-semibold text-lg backdrop-blur-sm transition-all hover:scale-105 hover:cursor-pointer hover:text-white active:scale-95 ${
                        isSelected
                          ? "border-purple-500 bg-gradient-to-r from-purple-500/20 to-indigo-600/20 text-white"
                          : "border-white/20 text-white hover:border-white/40 hover:bg-white/10"
                      }`}
                      disabled={selectedAnswer !== null}
                      onClick={() => handleAnswerSelect(answer)}
                      variant="outline"
                    >
                      {/* Shine effect on hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        initial={{ x: "-100%" }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ x: "100%" }}
                      />

                      {/* Answer text */}
                      <span className="relative z-10">{answer}</span>

                      {/* Selected indicator */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            animate={{ scale: 1 }}
                            className="absolute top-3 right-3"
                            exit={{ scale: 0 }}
                            initial={{ scale: 0 }}
                          >
                            <span className="text-2xl">✨</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Decorative elements */}
        <motion.div
          animate={{
            rotate: [0, 10, 0],
            y: [0, -10, 0],
          }}
          className="absolute top-1/4 left-10 text-6xl opacity-20"
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          🤖
        </motion.div>
        <motion.div
          animate={{
            rotate: [0, -10, 0],
            y: [0, 10, 0],
          }}
          className="absolute top-1/3 right-10 text-5xl opacity-20"
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          ⚡
        </motion.div>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, 0],
          }}
          className="absolute bottom-1/4 left-1/4 text-4xl opacity-20"
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          💥
        </motion.div>
      </div>
    </div>
  );
}
