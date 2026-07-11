/**
 * Builder Sidebar — left panel with the 8 question types.
 * Click any type to add it as a new question at the bottom of the form.
 */

"use client";

import { motion } from "framer-motion";
import { QUESTION_TYPES } from "@/lib/question-types";
import { useAddQuestion } from "@/hooks/useBuilder";
import { toast } from "sonner";

interface BuilderSidebarProps {
  formId: number;
}

export function BuilderSidebar({ formId }: BuilderSidebarProps) {
  const addQuestion = useAddQuestion(formId);

  const handleAddQuestion = async (type: string) => {
    const config = QUESTION_TYPES.find((t) => t.type === type);
    if (!config) return;

    try {
      await addQuestion.mutateAsync({
        title: config.defaultTitle,
        type: config.type,
        required: false,
        settings: config.defaultSettings || undefined,
      });
      toast.success(`Added ${config.label}`);
    } catch {
      toast.error("Failed to add question");
    }
  };

  return (
    <aside className="w-64 bg-[#191919] text-white flex flex-col h-full overflow-hidden shrink-0">
      {/* Header */}
      <div className="p-5 border-b border-white/10">
        <h2 className="text-sm font-semibold text-white/90">Question Types</h2>
        <p className="text-xs text-white/50 mt-1">Click to add to form</p>
      </div>

      {/* Question type list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {QUESTION_TYPES.map((qt, index) => (
          <motion.button
            key={qt.type}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04 }}
            onClick={() => handleAddQuestion(qt.type)}
            disabled={addQuestion.isPending}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-all duration-150 hover:bg-white/10 group cursor-pointer disabled:opacity-50"
          >
            <div className="h-7 w-7 rounded-md bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/70 group-hover:text-white transition-colors"
              >
                <path d={qt.icon} />
              </svg>
            </div>
            <span className="font-medium text-white/70 group-hover:text-white transition-colors">
              {qt.label}
            </span>
          </motion.button>
        ))}
      </div>
    </aside>
  );
}
