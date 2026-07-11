"use client";

import { use, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePublicForm, useSubmitResponse } from "@/hooks/usePublicForm";
import type { Question } from "@/types/form";
import { toast } from "sonner";
import Link from "next/link";

export default function PublicFormPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: form, isLoading, isError } = usePublicForm(slug);
  const submitResponse = useSubmitResponse(slug);

  const [currentIndex, setCurrentIndex] = useState(-1); // -1 is the welcome screen
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Global keydown listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in a textarea or text input
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      if (e.key === "Enter" && !e.shiftKey) {
        // Prevent default form submission if inside an input
        if (isInput) e.preventDefault();
        
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, answers, form]);

  const handleNext = async () => {
    if (!form) return;
    
    // Welcome screen -> first question
    if (currentIndex === -1) {
      if (form.questions.length > 0) setCurrentIndex(0);
      return;
    }

    const currentQ = form.questions[currentIndex];
    
    // Validation
    if (currentQ.required && !answers[currentQ.id]) {
      toast.error("Please answer this question before moving on.");
      return;
    }
    if (currentQ.type === "email" && answers[currentQ.id] && !answers[currentQ.id].includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Advance or submit
    if (currentIndex < form.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Submit
      try {
        const payload = {
          answers: Object.entries(answers).map(([qId, val]) => ({
            question_id: parseInt(qId, 10),
            value: val,
          })),
        };
        await submitResponse.mutateAsync(payload);
        setIsSubmitted(true);
      } catch {
        toast.error("Failed to submit response. Please try again.");
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(-1); // Back to welcome screen
    }
  };

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center bg-background"><div className="animate-pulse h-8 w-32 bg-muted rounded-full" /></div>;
  }

  if (isError || !form) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background text-center flex-col p-6">
        <h1 className="text-4xl font-light mb-4">Form not found</h1>
        <p className="text-muted-foreground text-lg mb-8">This form may be unpublished, deleted, or the link is incorrect.</p>
        <Link href="/" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium">Go home</Link>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background text-center flex-col p-6">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-24 w-24 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-8 mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
        </motion.div>
        <h1 className="text-5xl font-light mb-4">Thank you!</h1>
        <p className="text-xl text-muted-foreground font-light">Your response has been recorded.</p>
      </div>
    );
  }

  const progress = currentIndex === -1 ? 0 : ((currentIndex + 1) / form.questions.length) * 100;

  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden relative">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-muted">
        <motion.div 
          className="h-full bg-primary" 
          initial={{ width: 0 }} 
          animate={{ width: `${progress}%` }} 
          transition={{ duration: 0.3 }} 
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 md:p-24 relative max-w-4xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {currentIndex === -1 ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full text-center sm:text-left"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-foreground mb-6 leading-tight">
                {form.title}
              </h1>
              {form.description && (
                <p className="text-xl sm:text-2xl text-muted-foreground font-light mb-12 max-w-2xl">
                  {form.description}
                </p>
              )}
              <button
                onClick={handleNext}
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg text-xl font-medium hover:bg-primary/90 transition-colors shadow-lg active:scale-95"
              >
                Start
              </button>
              <div className="mt-4 text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1">
                press <span className="font-semibold bg-muted px-2 py-0.5 rounded">Enter ↵</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`q-${currentIndex}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full"
            >
              <QuestionDisplay 
                question={form.questions[currentIndex]} 
                index={currentIndex}
                value={answers[form.questions[currentIndex].id] || ""}
                onChange={(val) => handleAnswerChange(form.questions[currentIndex].id, val)}
                onEnter={handleNext}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Navigation */}
      {currentIndex !== -1 && (
        <div className="fixed bottom-0 left-0 w-full p-6 flex items-center justify-between pointer-events-none">
          <div className="flex gap-2 pointer-events-auto">
            <button
              onClick={handlePrev}
              className="h-10 w-10 bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center rounded-md transition-colors"
              aria-label="Previous question"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6"/></svg>
            </button>
            <button
              onClick={handleNext}
              className="h-10 w-10 bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center rounded-md transition-colors"
              aria-label="Next question"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
            </button>
          </div>
          
          <button
            onClick={handleNext}
            disabled={submitResponse.isPending}
            className="pointer-events-auto px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium text-lg shadow-lg hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
          >
            {currentIndex === form.questions.length - 1 ? "Submit" : "OK"}
            <span className="text-sm opacity-60 ml-1 hidden sm:inline">press Enter ↵</span>
          </button>
        </div>
      )}
    </div>
  );
}

// --- Specific Input Components ---

function QuestionDisplay({ question, index, value, onChange, onEnter }: { 
  question: Question; 
  index: number; 
  value: string; 
  onChange: (val: string) => void;
  onEnter: () => void;
}) {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Auto focus on mount
  useEffect(() => {
    if (question.type === "text" || question.type === "email" || question.type === "number" || question.type === "long_text") {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [question.id, question.type]);

  // Global key listener for choices shortcuts (A, B, C...)
  useEffect(() => {
    const handleChoiceKey = (e: KeyboardEvent) => {
      // Don't intercept if inside input
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
      
      const key = e.key.toUpperCase();
      
      if (question.type === "multiple_choice" || question.type === "dropdown") {
        const choices = (question.settings as any)?.choices || ["Option 1", "Option 2", "Option 3"];
        const charCode = key.charCodeAt(0);
        if (charCode >= 65 && charCode < 65 + choices.length) { // A, B, C...
          const selectedChoice = choices[charCode - 65];
          onChange(selectedChoice);
          // Small delay then next
          setTimeout(onEnter, 300);
        }
      }
      
      if (question.type === "yes_no") {
        if (key === "Y") {
          onChange("Yes");
          setTimeout(onEnter, 300);
        }
        if (key === "N") {
          onChange("No");
          setTimeout(onEnter, 300);
        }
      }
      
      if (question.type === "rating") {
        const max = (question.settings as any)?.max || 5;
        const num = parseInt(key, 10);
        if (num >= 1 && num <= max) {
          onChange(num.toString());
          setTimeout(onEnter, 300);
        }
      }
    };

    window.addEventListener("keydown", handleChoiceKey);
    return () => window.removeEventListener("keydown", handleChoiceKey);
  }, [question, onChange, onEnter]);

  return (
    <div>
      <div className="flex items-start gap-4 mb-4">
        <span className="text-2xl sm:text-3xl text-primary flex items-center font-light select-none">
          {index + 1}<span className="text-primary/50 ml-1 mr-2">→</span>
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-foreground leading-tight">
          {question.title}
          {question.required && <span className="text-destructive ml-3 text-2xl">*</span>}
        </h2>
      </div>

      {question.description && (
        <p className="text-xl text-muted-foreground font-light mb-8 ml-12 sm:ml-16">
          {question.description}
        </p>
      )}

      <div className="mt-8 ml-12 sm:ml-16">
        {renderInput(question, value, onChange, inputRef)}
      </div>
    </div>
  );
}

function renderInput(
  question: Question, 
  value: string, 
  onChange: (val: string) => void, 
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>
) {
  switch (question.type) {
    case "text":
    case "email":
      return (
        <input
          ref={inputRef as any}
          type={question.type === "email" ? "email" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full text-2xl sm:text-4xl font-light text-primary bg-transparent outline-none placeholder:text-muted-foreground/30 border-b border-primary/20 focus:border-primary pb-2 transition-colors"
        />
      );
    case "number":
      return (
        <input
          ref={inputRef as any}
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className="w-full text-2xl sm:text-4xl font-light text-primary bg-transparent outline-none placeholder:text-muted-foreground/30 border-b border-primary/20 focus:border-primary pb-2 transition-colors"
        />
      );
    case "long_text":
      return (
        <textarea
          ref={inputRef as any}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your answer here..."
          rows={3}
          className="w-full text-2xl sm:text-3xl font-light text-primary bg-transparent outline-none placeholder:text-muted-foreground/30 border-b border-primary/20 focus:border-primary pb-2 resize-none transition-colors"
        />
      );
    case "multiple_choice":
    case "dropdown": {
      const choices = (question.settings as any)?.choices || ["Option 1", "Option 2", "Option 3"];
      return (
        <div className="space-y-3">
          {choices.map((choice: string, i: number) => {
            const isSelected = value === choice;
            return (
              <button
                key={i}
                onClick={() => onChange(choice)}
                className={`w-full text-left flex items-center gap-4 px-6 py-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected 
                    ? "bg-primary/10 border-primary text-primary shadow-sm" 
                    : "border-primary/20 hover:bg-primary/5 text-foreground"
                }`}
              >
                <div className={`h-8 w-8 rounded-md border flex items-center justify-center text-sm font-semibold transition-colors ${
                  isSelected ? "border-primary bg-primary text-primary-foreground" : "border-primary/30 text-primary/70 bg-primary/5"
                }`}>
                  {String.fromCharCode(65 + i)}
                </div>
                <span className="text-2xl font-light">{choice}</span>
              </button>
            );
          })}
        </div>
      );
    }
    case "yes_no":
      return (
        <div className="flex flex-col sm:flex-row gap-4">
          {["Yes", "No"].map((opt) => {
            const isSelected = value === opt;
            const key = opt === "Yes" ? "Y" : "N";
            return (
              <button
                key={opt}
                onClick={() => onChange(opt)}
                className={`flex-1 flex items-center justify-center gap-4 py-6 rounded-xl border transition-all text-2xl font-light cursor-pointer ${
                  isSelected 
                    ? "bg-primary/10 border-primary text-primary shadow-sm" 
                    : "border-primary/20 hover:bg-primary/5 text-foreground"
                }`}
              >
                <div className={`h-7 w-7 rounded-md border flex items-center justify-center text-xs font-semibold transition-colors ${
                  isSelected ? "border-primary bg-primary text-primary-foreground" : "border-primary/30 text-primary/70 bg-primary/5"
                }`}>
                  {key}
                </div>
                {opt}
              </button>
            );
          })}
        </div>
      );
    case "rating": {
      const max = (question.settings as any)?.max || 5;
      return (
        <div className="flex flex-wrap gap-4">
          {Array.from({ length: max }, (_, i) => {
            const num = (i + 1).toString();
            const isSelected = value === num;
            return (
              <button
                key={num}
                onClick={() => onChange(num)}
                className={`h-16 w-14 rounded-xl border transition-all flex items-center justify-center text-2xl font-light cursor-pointer ${
                  isSelected 
                    ? "bg-primary text-primary-foreground border-primary scale-110 shadow-md" 
                    : "border-primary/20 hover:bg-primary/5 hover:scale-105"
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>
      );
    }
    default:
      return null;
  }
}
