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
    <aside className="w-64 border-r border-border/60 bg-muted/30 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border/40">
        <h2 className="text-sm font-semibold text-foreground">Question Types</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Click to add to form</p>
      </div>

      {/* Question type list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {QUESTION_TYPES.map((qt, index) => (
          <motion.button
            key={qt.type}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.04 }}
            onClick={() => handleAddQuestion(qt.type)}
            disabled={addQuestion.isPending}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-all duration-150 hover:bg-background hover:shadow-sm border border-transparent hover:border-border/60 group cursor-pointer disabled:opacity-50"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/30 dark:to-fuchsia-900/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
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
                className="text-violet-600 dark:text-violet-400"
              >
                <path d={qt.icon} />
              </svg>
            </div>
            <span className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {qt.label}
            </span>
          </motion.button>
        ))}
      </div>
    </aside>
  );
}
