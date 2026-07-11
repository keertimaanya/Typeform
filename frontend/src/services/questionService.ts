/**
 * Question Service — all API calls for question CRUD and reordering.
 */

import api from "@/lib/api";
import type { Question } from "@/types/form";

export interface QuestionCreate {
  form_id: number;
  title: string;
  description?: string;
  type: string;
  required?: boolean;
  settings?: Record<string, unknown>;
}

export interface QuestionUpdate {
  title?: string;
  description?: string;
  type?: string;
  required?: boolean;
  settings?: Record<string, unknown>;
}

export interface ReorderItem {
  question_id: number;
  position: number;
}

export const questionService = {
  /** Create a question in a form */
  async createQuestion(formId: number, data: QuestionCreate): Promise<Question> {
    const { data: result } = await api.post<Question>(`/forms/${formId}/questions`, data);
    return result;
  },

  /** Update a question */
  async updateQuestion(questionId: number, data: QuestionUpdate): Promise<Question> {
    const { data: result } = await api.put<Question>(`/questions/${questionId}`, data);
    return result;
  },

  /** Delete a question */
  async deleteQuestion(questionId: number): Promise<void> {
    await api.delete(`/questions/${questionId}`);
  },

  /** Reorder questions within a form */
  async reorderQuestions(formId: number, items: ReorderItem[]): Promise<Question[]> {
    const { data } = await api.put<Question[]>(`/forms/${formId}/questions/reorder`, { items });
    return data;
  },
};
