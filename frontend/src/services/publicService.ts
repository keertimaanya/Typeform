import api from "@/lib/api";
import type { FormDetail } from "@/types/form";

export interface AnswerSubmit {
  question_id: number;
  value: string;
}

export interface ResponseSubmit {
  answers: AnswerSubmit[];
}

export const publicService = {
  getPublicForm: async (slug: string): Promise<FormDetail> => {
    const response = await api.get(`/public/${slug}`);
    return response.data;
  },

  submitResponse: async (slug: string, data: ResponseSubmit) => {
    const response = await api.post(`/public/${slug}/submit`, data);
    return response.data;
  },
};
