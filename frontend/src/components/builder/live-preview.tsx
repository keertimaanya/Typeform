/**
 * Live Preview — right panel showing how the form looks to respondents.
 * Renders each question in a Typeform-style one-at-a-time preview.
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getQuestionTypeConfig } from "@/lib/question-types";
import type { Question } from "@/types/form";

interface LivePreviewProps {
  questions: Question[];
  formTitle: string;
}

export function LivePreview({ questions, formTitle }: LivePreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/></svg>
        </div>
        <p className="text-sm text-muted-foreground">
          Add questions to see a live preview
        </p>
      </div>
    );
  }

  const question = questions[currentIndex] || questions[0];
  const config = getQuestionTypeConfig(question.type);

  return (
    <div className="flex flex-col h-full">
      {/* Preview header */}
      <div className="p-3 border-b border-border/40">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Live Preview</h3>
      </div>

      {/* Preview content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-muted/30">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-xs"
          >
            {/* Question number */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-violet-600 bg-violet-100 dark:bg-violet-900/40 dark:text-violet-300 rounded-md px-2 py-0.5">
                {currentIndex + 1}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>

            {/* Question title */}
            <h2 className="text-lg font-semibold mb-1">
              {question.title}
              {question.required && <span className="text-destructive ml-1">*</span>}
            </h2>

            {/* Description */}
            {question.description && (
              <p className="text-sm text-muted-foreground mb-4">{question.description}</p>
            )}

            {/* Input preview based on type */}
            <div className="mt-4">
              {renderInputPreview(question, config?.type || question.type)}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation dots */}
      <div className="p-3 border-t border-border/40 flex items-center justify-center gap-2">
        {questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => setCurrentIndex(i)}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              i === currentIndex
                ? "w-6 bg-violet-500"
                : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/** Render a placeholder input based on question type */
function renderInputPreview(question: Question, type: string) {
  switch (type) {
    case "text":
      return (
        <div className="border-b-2 border-muted-foreground/20 pb-2">
          <span className="text-sm text-muted-foreground/50">Type your answer here...</span>
        </div>
      );
    case "long_text":
      return (
        <div className="border border-border/60 rounded-xl p-3 min-h-[80px]">
          <span className="text-sm text-muted-foreground/50">Type your answer here...</span>
        </div>
      );
    case "email":
      return (
        <div className="border-b-2 border-muted-foreground/20 pb-2">
          <span className="text-sm text-muted-foreground/50">name@example.com</span>
        </div>
      );
    case "number":
      return (
        <div className="border-b-2 border-muted-foreground/20 pb-2">
          <span className="text-sm text-muted-foreground/50">0</span>
        </div>
      );
    case "multiple_choice":
    case "dropdown": {
      const choices = (question.settings?.choices as string[]) || ["Option 1", "Option 2", "Option 3"];
      return (
        <div className="space-y-2">
          {choices.map((choice, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-border/60 hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-all cursor-pointer"
            >
              <span className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center text-xs font-semibold text-muted-foreground">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-sm">{choice}</span>
            </div>
          ))}
        </div>
      );
    }
    case "yes_no":
      return (
        <div className="flex gap-3">
          <button className="flex-1 py-3 rounded-xl border border-border/60 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all text-sm font-medium cursor-pointer">
            Yes
          </button>
          <button className="flex-1 py-3 rounded-xl border border-border/60 hover:border-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all text-sm font-medium cursor-pointer">
            No
          </button>
        </div>
      );
    case "rating": {
      const max = (question.settings?.max as number) || 5;
      return (
        <div className="flex gap-2 justify-center">
          {Array.from({ length: max }, (_, i) => (
            <button
              key={i}
              className="h-10 w-10 rounded-xl border border-border/60 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-all flex items-center justify-center text-sm font-semibold cursor-pointer hover:scale-110"
            >
              {i + 1}
            </button>
          ))}
        </div>
      );
    }
    default:
      return (
        <div className="border-b-2 border-muted-foreground/20 pb-2">
          <span className="text-sm text-muted-foreground/50">Type your answer here...</span>
        </div>
      );
  }
}
