/**
 * TanStack Query hooks for the Form Builder.
 * 
 * useFormDetail — fetches a single form with all questions.
 * useAddQuestion, useUpdateQuestion, useDeleteQuestion, useReorderQuestions
 * — mutations that auto-refresh the form detail cache after changes.
 */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formService } from "@/services/formService";
import { questionService } from "@/services/questionService";
import type { QuestionCreate, QuestionUpdate, ReorderItem } from "@/services/questionService";

const formKeys = {
  detail: (id: number) => ["forms", id] as const,
};

/** Fetch a single form with all its questions */
export function useFormDetail(formId: number) {
  return useQuery({
    queryKey: formKeys.detail(formId),
    queryFn: () => formService.getForm(formId),
    enabled: formId > 0,
  });
}

/** Add a new question to a form */
export function useAddQuestion(formId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<QuestionCreate, "form_id">) =>
      questionService.createQuestion(formId, { ...data, form_id: formId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: formKeys.detail(formId) });
    },
  });
}

/** Update a question */
export function useUpdateQuestion(formId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ questionId, data }: { questionId: number; data: QuestionUpdate }) =>
      questionService.updateQuestion(questionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: formKeys.detail(formId) });
    },
  });
}

/** Delete a question */
export function useDeleteQuestion(formId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionId: number) => questionService.deleteQuestion(questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: formKeys.detail(formId) });
    },
  });
}

/** Reorder questions after drag-and-drop */
export function useReorderQuestions(formId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: ReorderItem[]) =>
      questionService.reorderQuestions(formId, items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: formKeys.detail(formId) });
    },
  });
}
