import api from "@/lib/api";

export interface AnswerResponse {
  id: number;
  question_id: number;
  value: string;
}

export interface ResponseResponse {
  id: number;
  form_id: number;
  submitted_at: string;
  answers: AnswerResponse[];
}

export interface QuestionSummary {
  question_id: number;
  title: string;
  type: string;
  answer_count: number;
  answers: Record<string, number | string | any>;
}

export interface ResponseSummary {
  total_responses: number;
  questions: QuestionSummary[];
}

export const responseService = {
  getResponses: async (formId: number, skip = 0, limit = 100): Promise<ResponseResponse[]> => {
    const res = await api.get(`/forms/${formId}/responses?skip=${skip}&limit=${limit}`);
    return res.data;
  },

  getResponseSummary: async (formId: number): Promise<ResponseSummary> => {
    const res = await api.get(`/forms/${formId}/responses/summary`);
    return res.data;
  }
};
