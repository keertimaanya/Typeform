/**
 * Question Card — an individual question in the center panel.
 *
 * Features:
 * - Drag handle (dnd-kit)
 * - Inline title editing (click to edit, blur to save)
 * - Description toggle
 * - Question type selector
 * - Required toggle
 * - Duplicate and Delete buttons
 * - All changes persist to backend via API
 */

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
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
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(question.title);
  const [showDescription, setShowDescription] = useState(!!question.description);
  const [description, setDescription] = useState(question.description || "");
  const titleRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);

  const updateQuestion = useUpdateQuestion(formId);
  const deleteQuestion = useDeleteQuestion(formId);
  const addQuestion = useAddQuestion(formId);

  const config = getQuestionTypeConfig(question.type);

  // Sync from props when question changes from server
  useEffect(() => {
    setTitle(question.title);
    setDescription(question.description || "");
    setShowDescription(!!question.description);
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

  // Save title on blur
  const handleTitleBlur = useCallback(() => {
    setIsEditingTitle(false);
    if (title.trim() && title.trim() !== question.title) {
      updateQuestion.mutate({ questionId: question.id, data: { title: title.trim() } });
    } else {
      setTitle(question.title);
    }
  }, [title, question.title, question.id, updateQuestion]);

  // Save description on blur
  const handleDescriptionBlur = useCallback(() => {
    if (description !== (question.description || "")) {
      updateQuestion.mutate({
        questionId: question.id,
        data: { description: description || undefined },
      });
    }
  }, [description, question.description, question.id, updateQuestion]);

  // Toggle required
  const handleToggleRequired = () => {
    updateQuestion.mutate(
      { questionId: question.id, data: { required: !question.required } },
      { onError: () => toast.error("Failed to update") }
    );
  };

  // Change question type
  const handleTypeChange = (newType: string) => {
    const newConfig = QUESTION_TYPES.find((t) => t.type === newType);
    updateQuestion.mutate({
      questionId: question.id,
      data: { type: newType, settings: newConfig?.defaultSettings || undefined },
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
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className={`group relative rounded-2xl border bg-card shadow-sm transition-all duration-200 ${
        isDragging
          ? "border-violet-400 shadow-lg z-50"
          : "border-border/60 hover:border-border hover:shadow-md"
      }`}
    >
      {/* Top bar: drag handle + position + type badge + actions */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-2">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="h-7 w-7 flex items-center justify-center rounded-md cursor-grab active:cursor-grabbing hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg>
        </button>

        {/* Position number */}
        <span className="text-xs font-semibold text-muted-foreground bg-muted rounded-md px-2 py-0.5">
          {index + 1}
        </span>

        {/* Type icon + label */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {config && (
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-violet-500">
              <path d={config.icon} />
            </svg>
          )}
          <span>{config?.label || question.type}</span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Required toggle */}
        <button
          onClick={handleToggleRequired}
          className={`text-xs px-2 py-1 rounded-lg transition-all cursor-pointer ${
            question.required
              ? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 font-medium"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          {question.required ? "Required" : "Optional"}
        </button>

        {/* Duplicate */}
        <button
          onClick={handleDuplicate}
          className="h-7 w-7 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 hover:bg-muted transition-all text-muted-foreground hover:text-foreground cursor-pointer"
          title="Duplicate"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        </button>

        {/* Delete */}
        <button
          onClick={handleDelete}
          className="h-7 w-7 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-all text-muted-foreground hover:text-destructive cursor-pointer"
          title="Delete"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </div>

      {/* Title — inline editable */}
      <div className="px-4 pb-2">
        {isEditingTitle ? (
          <input
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={(e) => e.key === "Enter" && titleRef.current?.blur()}
            className="w-full text-base font-semibold bg-transparent border-b-2 border-violet-400 outline-none py-1"
            autoFocus
          />
        ) : (
          <h3
            onClick={() => {
              setIsEditingTitle(true);
              setTimeout(() => titleRef.current?.focus(), 0);
            }}
            className="text-base font-semibold cursor-text py-1 hover:text-violet-600 transition-colors"
          >
            {question.title}
          </h3>
        )}
      </div>

      {/* Description */}
      <div className="px-4 pb-3">
        {showDescription ? (
          <input
            ref={descRef}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleDescriptionBlur}
            placeholder="Add a description..."
            className="w-full text-sm text-muted-foreground bg-transparent border-b border-border/60 outline-none py-1 focus:border-violet-400 transition-colors"
          />
        ) : (
          <button
            onClick={() => {
              setShowDescription(true);
              setTimeout(() => descRef.current?.focus(), 0);
            }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            + Add description
          </button>
        )}
      </div>

      {/* Bottom bar: type selector + settings hint */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-t border-border/40 bg-muted/20 rounded-b-2xl">
        <span className="text-xs text-muted-foreground mr-1">Type:</span>
        <select
          value={question.type}
          onChange={(e) => handleTypeChange(e.target.value)}
          className="text-xs bg-background border border-border/60 rounded-lg px-2 py-1.5 cursor-pointer outline-none focus:border-violet-400 transition-colors"
        >
          {QUESTION_TYPES.map((qt) => (
            <option key={qt.type} value={qt.type}>
              {qt.label}
            </option>
          ))}
        </select>

        {/* Settings preview for choice-based questions */}
        {question.settings &&
          "choices" in question.settings &&
          Array.isArray(question.settings.choices) && (
            <span className="text-xs text-muted-foreground ml-2">
              {question.settings.choices.length} options
            </span>
          )}
        {question.settings &&
          "max" in question.settings && (
            <span className="text-xs text-muted-foreground ml-2">
              1–{String(question.settings.max)} scale
            </span>
          )}
      </div>
    </motion.div>
  );
}
