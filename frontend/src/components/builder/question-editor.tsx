"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUpdateQuestion } from "@/hooks/useBuilder";
import { getQuestionTypeConfig } from "@/lib/question-types";
import type { Question } from "@/types/form";

interface QuestionEditorProps {
  question: Question;
  formId: number;
  index: number;
}

export function QuestionEditor({ question, formId, index }: QuestionEditorProps) {
  const [title, setTitle] = useState(question.title);
  const [description, setDescription] = useState(question.description || "");
  const updateQuestion = useUpdateQuestion(formId);
  const config = getQuestionTypeConfig(question.type);

  // Sync state when active question changes
  useEffect(() => {
    setTitle(question.title);
    setDescription(question.description || "");
  }, [question.id, question.title, question.description]);

  const handleTitleBlur = useCallback(() => {
    if (title.trim() && title.trim() !== question.title) {
      updateQuestion.mutate({ questionId: question.id, data: { title: title.trim() } });
    } else {
      setTitle(question.title); // revert if empty
    }
  }, [title, question.title, question.id, updateQuestion]);

  const handleDescriptionBlur = useCallback(() => {
    if (description !== (question.description || "")) {
      updateQuestion.mutate({
        questionId: question.id,
        data: { description: description || undefined },
      });
    }
  }, [description, question.description, question.id, updateQuestion]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-3xl bg-white p-12 rounded-2xl shadow-sm border border-border/50 text-center"
        >
          {/* Question Number Indicator */}
          <div className="flex items-center justify-center gap-2 mb-6 text-primary font-medium">
            <span className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center text-xs">
              {index + 1}
            </span>
            <span className="text-sm uppercase tracking-wider text-muted-foreground">
              {config?.label || question.type}
            </span>
            {question.required && <span className="text-destructive text-sm ml-1">* Required</span>}
          </div>

          {/* Title Editor */}
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            placeholder="Your question here..."
            className="w-full text-3xl font-light text-foreground bg-transparent outline-none placeholder:text-muted-foreground/30 text-center resize-none overflow-hidden"
            rows={2}
            style={{ minHeight: "80px" }}
          />

          {/* Description Editor */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleDescriptionBlur}
            placeholder="Description (optional)"
            className="w-full text-lg text-muted-foreground font-light bg-transparent outline-none placeholder:text-muted-foreground/30 text-center mt-2 resize-none"
            rows={2}
          />

          {/* Mock Input Area (Visual representation only) */}
          <div className="mt-12 max-w-lg mx-auto pointer-events-none opacity-60">
            {renderMockInput(question, config?.type || question.type)}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function renderMockInput(question: Question, type: string) {
  switch (type) {
    case "text":
    case "email":
    case "number":
      return (
        <div className="space-y-6">
          <div className="border-b-2 border-primary/20 pb-2 text-left">
            <span className="text-2xl font-light text-muted-foreground/30">Type your answer here...</span>
          </div>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-bold text-lg">
            OK
          </button>
        </div>
      );
    case "long_text":
      return (
        <div className="space-y-6">
          <div className="border-b-2 border-primary/20 pb-8 pt-2 text-left">
            <span className="text-2xl font-light text-muted-foreground/30">Type your answer here...</span>
          </div>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-md font-bold text-lg">
            OK
          </button>
        </div>
      );
    case "multiple_choice":
    case "dropdown": {
      const choices = (question.settings as any)?.choices || ["Option 1", "Option 2", "Option 3"];
      return (
        <div className="space-y-3">
          {choices.map((choice: string, i: number) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-lg border border-primary/20 bg-primary/5">
              <div className="h-7 w-7 rounded-md border border-primary/30 flex items-center justify-center text-sm font-semibold text-primary/70 bg-primary/5">
                {String.fromCharCode(65 + i)}
              </div>
              <span className="text-xl font-light text-left block w-full">{choice}</span>
            </div>
          ))}
        </div>
      );
    }
    case "yes_no":
      return (
        <div className="flex gap-4">
          <button className="flex-1 py-4 rounded-lg border border-primary/20 bg-primary/5 text-xl font-light flex items-center justify-center gap-3">
            <span className="h-6 w-6 rounded-md border border-primary/30 flex items-center justify-center text-xs font-semibold text-primary/70 bg-primary/5">Y</span>
            Yes
          </button>
          <button className="flex-1 py-4 rounded-lg border border-primary/20 bg-primary/5 text-xl font-light flex items-center justify-center gap-3">
            <span className="h-6 w-6 rounded-md border border-primary/30 flex items-center justify-center text-xs font-semibold text-primary/70 bg-primary/5">N</span>
            No
          </button>
        </div>
      );
    case "rating": {
      const max = (question.settings as any)?.max || 5;
      return (
        <div className="flex flex-wrap gap-3 justify-center">
          {Array.from({ length: max }, (_, i) => (
            <button key={i} className="h-14 w-12 rounded-lg border border-primary/20 bg-primary/5 flex items-center justify-center text-xl font-light">
              {i + 1}
            </button>
          ))}
        </div>
      );
    }
    default:
      return null;
  }
}
