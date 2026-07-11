/**
 * Form Service — all API calls related to forms.
 * 
 * This is the "service layer" for the frontend.
 * Components never call axios directly — they call these functions instead.
 * This keeps API logic in one place and makes it easy to change endpoints.
 */

import api from "@/lib/api";
import type { Form, FormDetail, FormCreate, FormUpdate } from "@/types/form";

export const formService = {
  /** Get all forms */
  async getForms(): Promise<Form[]> {
    const { data } = await api.get<Form[]>("/forms/");
    return data;
  },

  /** Get a single form with questions and response count */
  async getForm(id: number): Promise<FormDetail> {
    const { data } = await api.get<FormDetail>(`/forms/${id}`);
    return data;
  },

  /** Create a new form */
  async createForm(form: FormCreate): Promise<Form> {
    const { data } = await api.post<Form>("/forms/", form);
    return data;
  },

  /** Update a form (title, description, status) */
  async updateForm(id: number, form: FormUpdate): Promise<Form> {
    const { data } = await api.put<Form>(`/forms/${id}`, form);
    return data;
  },

  /** Delete a form */
  async deleteForm(id: number): Promise<void> {
    await api.delete(`/forms/${id}`);
  },

  /** Duplicate a form */
  async duplicateForm(id: number): Promise<Form> {
    const { data } = await api.post<Form>(`/forms/${id}/duplicate`);
    return data;
  },

  /** Publish a form */
  async publishForm(id: number): Promise<Form> {
    const { data } = await api.post<Form>(`/forms/${id}/publish`);
    return data;
  },

  /** Unpublish a form */
  async unpublishForm(id: number): Promise<Form> {
    const { data } = await api.post<Form>(`/forms/${id}/unpublish`);
    return data;
  },
};
