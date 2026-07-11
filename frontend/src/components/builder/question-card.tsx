/**
 * Question Card — an individual question in the center panel.
 * Designed to mimic Typeform's clean, typography-focused builder.
 */

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion, AnimatePresence } from "framer-motion";
import { QUESTION_TYPES, getQuestionTypeConfig } from "@/lib/question-types";
import { useUpdateQuestion, useDeleteQuestion, useAddQuestion } from "@/hooks/useBuilder";
import { toast } from "sonner";
import type { Question } from "@/types/form";

interface QuestionCardProps {
  question: Question;
  formId: number;
  index: number;
}

export function QuestionCard({ question, formId, index }: QuestionCardProps) {
  const [title, setTitle] = useState(question.title);
  const [description, setDescription] = useState(question.description || "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const updateQuestion = useUpdateQuestion(formId);
  const deleteQuestion = useDeleteQuestion(formId);
  const addQuestion = useAddQuestion(formId);

  const config = getQuestionTypeConfig(question.type);

  // Sync from props
  useEffect(() => {
    setTitle(question.title);
    setDescription(question.description || "");
  }, [question.title, question.description]);

  // dnd-kit sortable
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Blur handlers for autosave
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

  // Settings editors (Choices & Rating)
  const handleChoicesChange = (newChoices: string[]) => {
    updateQuestion.mutate({
      questionId: question.id,
      data: { settings: { ...question.settings, choices: newChoices } },
    });
  };

  const handleMaxRatingChange = (newMax: number) => {
    updateQuestion.mutate({
      questionId: question.id,
      data: { settings: { ...question.settings, max: newMax } },
    });
  };

  // Duplicate
  const handleDuplicate = async () => {
    try {
      await addQuestion.mutateAsync({
        title: question.title,
        description: question.description || undefined,
        type: question.type,
        required: question.required,
        settings: question.settings || undefined,
      });
      toast.success("Question duplicated");
    } catch {
      toast.error("Failed to duplicate");
    }
  };

  // Delete
  const handleDelete = async () => {
    try {
      await deleteQuestion.mutateAsync(question.id);
      toast.success("Question deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: isDragging ? 0.4 : 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className={`group relative rounded-xl bg-white dark:bg-card transition-all duration-200 mb-6 ${
        isDragging
          ? "shadow-2xl ring-2 ring-primary z-50 scale-[1.02]"
          : "hover:shadow-md border border-border/40 hover:border-border/80"
      }`}
    >
      {/* Absolute Drag Handle (Left Side) */}
      <div 
        {...attributes}
        {...listeners}
        className="absolute -left-3 top-1/2 -translate-y-1/2 h-8 w-6 flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded-md shadow-sm z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
      </div>

      <div className="p-8 pb-6">
        {/* Top actions */}
        <div className="flex items-center justify-between mb-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
              {config?.label || question.type}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => updateQuestion.mutate({ questionId: question.id, data: { required: !question.required } })}
              className={`text-xs px-2.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                question.required ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {question.required ? "Required" : "Optional"}
            </button>
            <div className="w-px h-4 bg-border mx-1" />
            <button onClick={handleDuplicate} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md cursor-pointer" title="Duplicate">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            </button>
            <div className="relative">
              <button onClick={() => setShowDeleteConfirm(true)} className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md cursor-pointer" title="Delete">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
              
              <AnimatePresence>
                {showDeleteConfirm && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 5 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-background border shadow-xl rounded-lg p-3 z-50"
                  >
                    <p className="text-sm font-medium mb-3">Delete question?</p>
                    <div className="flex gap-2">
                      <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-1.5 px-2 bg-muted text-muted-foreground rounded text-xs font-medium hover:bg-muted/80 transition-colors">
                        Cancel
                      </button>
                      <button onClick={handleDelete} className="flex-1 py-1.5 px-2 bg-destructive text-destructive-foreground rounded text-xs font-medium hover:bg-destructive/90 transition-colors">
                        Delete
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Title Area (Typeform style) */}
        <div className="flex items-start gap-3 mb-2">
          <span className="text-xl font-light text-primary mt-1 select-none flex items-center">
            {index + 1}<span className="text-primary/50 ml-1">→</span>
          </span>
          <div className="flex-1">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              placeholder="Your question here..."
              className="w-full text-2xl font-light text-foreground bg-transparent outline-none placeholder:text-muted-foreground/40 border-b border-transparent focus:border-primary/20 pb-1 transition-colors"
            />
          </div>
        </div>

        {/* Description Area */}
        <div className="ml-10">
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleDescriptionBlur}
            placeholder="Description (optional)"
            className="w-full text-base text-muted-foreground bg-transparent outline-none placeholder:text-muted-foreground/30 border-b border-transparent focus:border-primary/20 pb-1 transition-colors"
          />
        </div>

        {/* Settings Area (Choices / Rating) */}
        <div className="ml-10 mt-6">
          {(question.type === "multiple_choice" || question.type === "dropdown") && (
            <div className="space-y-2">
              {((question.settings as any)?.choices || ["Option 1"]).map((choice: string, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-md bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground border border-border/50">
                    {String.fromCharCode(65 + i)}
                  </div>
                  <input
                    value={choice}
                    onChange={(e) => {
                      const newChoices = [...((question.settings as any)?.choices || [])];
                      newChoices[i] = e.target.value;
                      handleChoicesChange(newChoices);
                    }}
                    placeholder={`Option ${i + 1}`}
                    className="flex-1 text-sm bg-muted/30 border border-transparent hover:border-border focus:border-primary focus:bg-transparent rounded-md px-3 py-1.5 outline-none transition-all"
                  />
                  <button
                    onClick={() => {
                      const newChoices = ((question.settings as any)?.choices || []).filter((_: any, idx: number) => idx !== i);
                      handleChoicesChange(newChoices);
                    }}
                    className="p-1.5 text-muted-foreground/50 hover:text-destructive transition-colors cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newChoices = [...((question.settings as any)?.choices || []), `Option ${((question.settings as any)?.choices || []).length + 1}`];
                  handleChoicesChange(newChoices);
                }}
                className="text-xs font-medium text-primary hover:text-primary/80 mt-2 px-1 cursor-pointer transition-colors"
              >
                + Add Choice
              </button>
            </div>
          )}

          {question.type === "rating" && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Rating Scale:</span>
              <select
                value={(question.settings as any)?.max || 5}
                onChange={(e) => handleMaxRatingChange(parseInt(e.target.value, 10))}
                className="text-sm border border-border rounded-md bg-transparent px-2 py-1 outline-none focus:border-primary cursor-pointer"
              >
                {[3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>1 to {num}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
