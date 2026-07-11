"use client";

import { use } from "react";
import { usePublicForm, useSubmitResponse } from "@/hooks/usePublicForm";
import Link from "next/link";
import { FormViewer } from "@/components/respondent/form-viewer";
import { toast } from "sonner";

export default function PublicFormPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data: form, isLoading, isError } = usePublicForm(slug);
  const submitResponse = useSubmitResponse(slug);

  const handleSubmit = async (payload: { answers: { question_id: number; value: string }[] }) => {
    try {
      await submitResponse.mutateAsync(payload);
    } catch (e) {
      toast.error("Oops! Something went wrong.", { position: "bottom-center" });
      throw e;
    }
  };

  if (isLoading) {
    return <div className="h-[100dvh] w-full bg-white flex items-center justify-center"><div className="animate-pulse h-2 w-32 bg-gray-200 rounded-full" /></div>;
  }

  if (isError || !form) {
    return (
      <div className="h-[100dvh] w-full bg-white flex flex-col items-center justify-center p-6 text-slate-800">
        <h1 className="text-3xl font-light mb-4">Form not found</h1>
        <p className="text-slate-500 mb-8">This form may be unpublished or deleted.</p>
        <Link href="/" className="px-6 py-3 bg-slate-800 text-white rounded font-medium hover:bg-slate-700 transition-colors">Go home</Link>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full bg-white font-sans text-slate-800">
      <FormViewer 
        form={form} 
        onSubmit={handleSubmit} 
        isPending={submitResponse.isPending} 
      />
    </div>
  );
}
