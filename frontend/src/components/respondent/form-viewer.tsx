"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FormDetail, Question } from "@/types/form";
import { toast } from "sonner";

interface FormViewerProps {
  form: FormDetail;
  onSubmit: (payload: { answers: { question_id: number; value: string }[] }) => Promise<void>;
  isPending: boolean;
  isPreview?: boolean;
}

export function FormViewer({ form, onSubmit, isPending, isPreview = false }: FormViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Global keydown listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      if (e.key === "Enter" && !e.shiftKey) {
        if (isInput) e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, answers, form]);

  const handleNext = async () => {
    if (!form) return;
    
    if (currentIndex === -1) {
      if (form.questions.length > 0) setCurrentIndex(0);
      return;
    }

    const currentQ = form.questions[currentIndex];
    
    if (currentQ.required && !answers[currentQ.id]) {
      toast.error("Please fill this in", { position: "bottom-center" });
      return;
    }
    if (currentQ.type === "email" && answers[currentQ.id] && !answers[currentQ.id].includes("@")) {
      toast.error("Hmm... that email doesn't look right", { position: "bottom-center" });
      return;
    }

    if (currentIndex < form.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      try {
        const payload = {
          answers: Object.entries(answers).map(([qId, val]) => ({
            question_id: parseInt(qId, 10),
            value: val,
          })),
        };
        await onSubmit(payload);
        setIsSubmitted(true);
      } catch {
        toast.error("Oops! Something went wrong.", { position: "bottom-center" });
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(-1);
    }
  };

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  if (isSubmitted) {
    return (
      <div className="h-full w-full bg-white flex flex-col items-center justify-center p-6 text-slate-800 text-center">
        <AnimatePresence>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
            <div className="h-20 w-20 bg-slate-800 text-white rounded-full flex items-center justify-center mb-8 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-light mb-4 text-slate-800">Done!</h1>
            <p className="text-xl text-slate-500 font-light">
              {isPreview ? "Your preview response has been simulated." : "Your response has been recorded."}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  const progress = currentIndex === -1 ? 0 : ((currentIndex + 1) / form.questions.length) * 100;

  return (
    <div className="h-full w-full bg-white flex flex-col overflow-hidden relative font-sans text-slate-800 rounded-inherit">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-100 z-50">
        <motion.div 
          className="h-full bg-slate-800" 
          initial={{ width: 0 }} 
          animate={{ width: `${progress}%` }} 
          transition={{ duration: 0.5, ease: "easeInOut" }} 
        />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-3xl mx-auto px-6 sm:px-12 relative h-full">
        <AnimatePresence mode="wait">
          {currentIndex === -1 ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -60 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full text-left flex flex-col justify-center h-full pt-10 pb-32"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal text-slate-900 mb-6 leading-tight">
                {form.title}
              </h1>
              {form.description && (
                <p className="text-xl sm:text-2xl text-slate-500 font-light mb-12">
                  {form.description}
                </p>
              )}
              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-slate-800 text-white rounded text-xl font-medium hover:bg-slate-700 transition-colors active:scale-95 flex items-center gap-2 cursor-pointer"
                >
                  Start
                </button>
                <div className="text-sm text-slate-400 flex items-center gap-1 font-medium">
                  press <span className="font-bold text-slate-500">Enter ↵</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`q-${currentIndex}`}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -60 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full flex flex-col justify-center pt-10 pb-32"
            >
              <QuestionDisplay 
                question={form.questions[currentIndex]} 
                index={currentIndex}
                value={answers[form.questions[currentIndex].id] || ""}
                onChange={(val) => handleAnswerChange(form.questions[currentIndex].id, val)}
                onEnter={handleNext}
                isLast={currentIndex === form.questions.length - 1}
                isPending={isPending}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Bottom Nav */}
      {currentIndex !== -1 && (
        <div className="absolute bottom-6 right-6 flex items-center gap-2 z-50">
          <button
            onClick={handlePrev}
            className="h-9 w-9 bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center rounded cursor-pointer transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m18 15-6-6-6 6"/></svg>
          </button>
          <button
            onClick={handleNext}
            className="h-9 w-9 bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center rounded cursor-pointer transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
          </button>
        </div>
      )}
    </div>
  );
}

// --- Specific Input Components ---

function QuestionDisplay({ question, index, value, onChange, onEnter, isLast, isPending }: { 
  question: Question; 
  index: number; 
  value: string; 
  onChange: (val: string) => void;
  onEnter: () => void;
  isLast: boolean;
  isPending: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Auto focus
  useEffect(() => {
    if (question.type === "text" || question.type === "email" || question.type === "number" || question.type === "long_text") {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [question.id, question.type]);

  // Keyboard shortcuts for choices
  useEffect(() => {
    const handleChoiceKey = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
      
      const key = e.key.toUpperCase();
      
      if (question.type === "multiple_choice" || question.type === "dropdown") {
        const choices = (question.settings as any)?.choices || ["Option 1", "Option 2", "Option 3"];
        const charCode = key.charCodeAt(0);
        if (charCode >= 65 && charCode < 65 + choices.length) {
          onChange(choices[charCode - 65]);
          setTimeout(onEnter, 400); // slight delay to show selection
        }
      }
      
      if (question.type === "yes_no") {
        if (key === "Y") { onChange("Yes"); setTimeout(onEnter, 400); }
        if (key === "N") { onChange("No"); setTimeout(onEnter, 400); }
      }
      
      if (question.type === "rating") {
        const max = (question.settings as any)?.max || 5;
        const num = parseInt(key, 10);
        if (num >= 1 && num <= max) {
          onChange(num.toString());
          setTimeout(onEnter, 400);
        }
      }
    };

    window.addEventListener("keydown", handleChoiceKey);
    return () => window.removeEventListener("keydown", handleChoiceKey);
  }, [question, onChange, onEnter]);

  // Check if we should show the OK button
  const hasValue = value.trim().length > 0;
  const showOk = hasValue || !question.required;
  const requiresOkButton = ["text", "long_text", "email", "number"].includes(question.type);

  return (
    <div className="flex flex-col w-full">
      {/* Title block */}
      <div className="flex items-start mb-2">
        <div className="flex items-center text-xl sm:text-2xl text-slate-800 font-normal shrink-0 mr-3 mt-1">
          {index + 1}<span className="ml-1 text-slate-400">→</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-slate-900 leading-snug">
          {question.title || "..."}
          {question.required && <span className="text-red-500 ml-2 text-2xl">*</span>}
        </h2>
      </div>

      {question.description && (
        <p className="text-lg sm:text-xl text-slate-500 font-light mb-8 ml-[42px] sm:ml-[48px]">
          {question.description}
        </p>
      )}

      {/* Input area */}
      <div className={`ml-[42px] sm:ml-[48px] ${question.description ? 'mt-4' : 'mt-10'}`}>
        {renderInput(question, value, onChange, inputRef, onEnter)}

        {/* The Typeform OK Button */}
        {requiresOkButton && (
          <div className="mt-8 h-12">
            <AnimatePresence>
              {showOk && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: 10 }}
                  className="flex items-center gap-4"
                >
                  <button
                    onClick={onEnter}
                    disabled={isPending}
                    className="px-6 py-2.5 bg-slate-800 text-white rounded text-xl font-medium hover:bg-slate-700 transition-colors cursor-pointer shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isLast ? "Submit" : "OK"}
                    {!isLast && <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>}
                  </button>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    press <span className="font-bold text-slate-500">Enter ↵</span>
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Submit button for non-text inputs */}
        {!requiresOkButton && isLast && (
           <div className="mt-8 h-12">
             <AnimatePresence>
               {showOk && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4">
                   <button
                     onClick={onEnter}
                     disabled={isPending}
                     className="px-6 py-2.5 bg-slate-800 text-white rounded text-xl font-medium hover:bg-slate-700 transition-colors cursor-pointer shadow-md active:scale-95"
                   >
                     Submit
                   </button>
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
        )}
      </div>
    </div>
  );
}

function renderInput(
  question: Question, 
  value: string, 
  onChange: (val: string) => void, 
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>,
  onEnter: () => void
) {
  const handleChoiceClick = (val: string) => {
    onChange(val);
    setTimeout(onEnter, 400);
  };

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
          className="w-full text-2xl sm:text-3xl font-light text-slate-800 bg-transparent outline-none placeholder:text-slate-300 border-b-2 border-slate-200 focus:border-slate-800 pb-2 transition-colors"
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
          className="w-full text-2xl sm:text-3xl font-light text-slate-800 bg-transparent outline-none placeholder:text-slate-300 border-b-2 border-slate-200 focus:border-slate-800 pb-2 transition-colors"
        />
      );
    case "long_text":
      return (
        <textarea
          ref={inputRef as any}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your answer here..."
          rows={1}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = target.scrollHeight + 'px';
          }}
          className="w-full text-2xl sm:text-3xl font-light text-slate-800 bg-transparent outline-none placeholder:text-slate-300 border-b-2 border-slate-200 focus:border-slate-800 pb-2 resize-none transition-colors overflow-hidden"
        />
      );
    case "multiple_choice":
    case "dropdown": {
      const choices = (question.settings as any)?.choices || ["Option 1", "Option 2", "Option 3"];
      return (
        <div className="space-y-2 w-full max-w-lg">
          {choices.map((choice: string, i: number) => {
            const isSelected = value === choice;
            return (
              <button
                key={i}
                onClick={() => handleChoiceClick(choice)}
                className={`w-full text-left flex items-center gap-3 p-2 rounded-lg border transition-all cursor-pointer group ${
                  isSelected 
                    ? "bg-slate-100/80 border-slate-400" 
                    : "bg-slate-50/50 border-slate-200/60 hover:bg-slate-100 hover:border-slate-300"
                }`}
              >
                <div className={`h-7 w-7 rounded flex items-center justify-center text-xs font-bold border transition-colors shrink-0 ${
                  isSelected ? "border-slate-800 bg-slate-800 text-white" : "border-slate-300 bg-white text-slate-600 group-hover:border-slate-400 group-hover:bg-slate-50"
                }`}>
                  {String.fromCharCode(65 + i)}
                </div>
                <span className={`text-xl font-normal flex-1 transition-colors ${isSelected ? "text-slate-900" : "text-slate-700"}`}>
                  {choice}
                </span>
                {isSelected && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-800 mr-2 shrink-0"><path d="M20 6 9 17l-5-5"/></svg>
                )}
              </button>
            );
          })}
        </div>
      );
    }
    case "yes_no":
      return (
        <div className="flex flex-col gap-2 w-full max-w-xs">
          {["Yes", "No"].map((opt) => {
            const isSelected = value === opt;
            const key = opt === "Yes" ? "Y" : "N";
            return (
              <button
                key={opt}
                onClick={() => handleChoiceClick(opt)}
                className={`w-full text-left flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer group ${
                  isSelected 
                    ? "bg-slate-100/80 border-slate-400" 
                    : "bg-slate-50/50 border-slate-200/60 hover:bg-slate-100 hover:border-slate-300"
                }`}
              >
                <div className={`h-7 w-7 rounded flex items-center justify-center text-xs font-bold border transition-colors shrink-0 ${
                  isSelected ? "border-slate-800 bg-slate-800 text-white" : "border-slate-300 bg-white text-slate-600 group-hover:border-slate-400 group-hover:bg-slate-50"
                }`}>
                  {key}
                </div>
                <span className={`text-xl font-normal flex-1 transition-colors ${isSelected ? "text-slate-900" : "text-slate-700"}`}>
                  {opt}
                </span>
                {isSelected && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-800 mr-2 shrink-0"><path d="M20 6 9 17l-5-5"/></svg>
                )}
              </button>
            );
          })}
        </div>
      );
    case "rating": {
      const max = (question.settings as any)?.max || 5;
      return (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: max }, (_, i) => {
            const num = (i + 1).toString();
            const isSelected = value === num;
            return (
              <button
                key={num}
                onClick={() => handleChoiceClick(num)}
                className={`h-14 w-12 rounded border transition-all flex items-center justify-center text-xl font-normal cursor-pointer ${
                  isSelected 
                    ? "bg-slate-800 text-white border-slate-800 shadow-sm" 
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
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
