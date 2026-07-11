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
            className="w-full max-w-md"
          >
            {/* Question title */}
            <div className="flex items-start gap-3 mb-2">
              <span className="text-2xl font-light text-primary mt-0.5 select-none flex items-center">
                {currentIndex + 1}<span className="text-primary/50 ml-1">→</span>
              </span>
              <h2 className="text-2xl font-light text-foreground mb-1 leading-snug">
                {question.title || "Your question here..."}
                {question.required && <span className="text-destructive ml-2">*</span>}
              </h2>
            </div>

            {/* Description */}
            {question.description && (
              <p className="text-lg text-muted-foreground mb-6 ml-9 font-light">{question.description}</p>
            )}

            {/* Input preview based on type */}
            <div className="mt-8 ml-9">
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
    case "email":
    case "number":
      return (
        <div className="border-b-2 border-primary/20 pb-2">
          <span className="text-2xl font-light text-muted-foreground/30">Type your answer here...</span>
        </div>
      );
    case "long_text":
      return (
        <div className="border-b-2 border-primary/20 pb-8 pt-2">
          <span className="text-2xl font-light text-muted-foreground/30">Type your answer here...</span>
        </div>
      );
    case "multiple_choice":
    case "dropdown": {
      const choices = (question.settings as any)?.choices || ["Option 1", "Option 2", "Option 3"];
      return (
        <div className="space-y-3">
          {choices.map((choice: string, i: number) => (
            <div
              key={i}
              className="flex items-center gap-4 px-4 py-3 rounded-lg border border-primary/20 hover:bg-primary/5 transition-all cursor-pointer"
            >
              <div className="h-7 w-7 rounded-md border border-primary/30 flex items-center justify-center text-sm font-semibold text-primary/70 bg-primary/5">
                {String.fromCharCode(65 + i)}
              </div>
              <span className="text-xl font-light">{choice}</span>
            </div>
          ))}
        </div>
      );
    }
    case "yes_no":
      return (
        <div className="flex gap-4">
          <button className="flex-1 py-4 rounded-lg border border-primary/20 hover:bg-primary/5 transition-all text-xl font-light cursor-pointer flex items-center justify-center gap-3">
            <span className="h-6 w-6 rounded-md border border-primary/30 flex items-center justify-center text-xs font-semibold text-primary/70 bg-primary/5">Y</span>
            Yes
          </button>
          <button className="flex-1 py-4 rounded-lg border border-primary/20 hover:bg-primary/5 transition-all text-xl font-light cursor-pointer flex items-center justify-center gap-3">
            <span className="h-6 w-6 rounded-md border border-primary/30 flex items-center justify-center text-xs font-semibold text-primary/70 bg-primary/5">N</span>
            No
          </button>
        </div>
      );
    case "rating": {
      const max = (question.settings as any)?.max || 5;
      return (
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: max }, (_, i) => (
            <button
              key={i}
              className="h-14 w-12 rounded-lg border border-primary/20 hover:bg-primary/5 transition-all flex items-center justify-center text-xl font-light cursor-pointer"
            >
              {i + 1}
            </button>
          ))}
        </div>
      );
    }
    default:
      return (
        <div className="border-b-2 border-primary/20 pb-2">
          <span className="text-2xl font-light text-muted-foreground/30">Type your answer here...</span>
        </div>
      );
  }
}
