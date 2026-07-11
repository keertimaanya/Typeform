/** Shared TypeScript types matching the backend Pydantic schemas. */

export interface Form {
  id: number;
  title: string;
  description: string | null;
  status: "draft" | "published";
  share_slug: string;
  created_at: string;
  updated_at: string;
}

export interface FormDetail extends Form {
  questions: Question[];
  response_count: number;
}

export interface Question {
  id: number;
  form_id: number;
  title: string;
  description: string | null;
  type: string;
  required: boolean;
  position: number;
  settings: Record<string, unknown> | null;
}

export interface FormCreate {
  title: string;
  description?: string;
}

export interface FormUpdate {
  title?: string;
  description?: string;
  status?: string;
}

export interface ApiError {
  detail: string;
}
