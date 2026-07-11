/**
 * Builder Page — /builder/[formId]
 *
 * Three-panel layout:
 * [Left Sidebar] [Center Question Editor] [Right Live Preview]
 *
 * Fetches the form with questions from the API,
 * then renders the builder layout.
 */

"use client";

import { use, useState, useEffect } from "react";
import { useFormDetail } from "@/hooks/useBuilder";
import { BuilderHeader } from "@/components/builder/builder-header";
import { BuilderSidebar } from "@/components/builder/builder-sidebar";
import { QuestionEditor } from "@/components/builder/question-editor";
import { QuestionSettings } from "@/components/builder/question-settings";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BuilderPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId: formIdStr } = use(params);
  const formId = parseInt(formIdStr, 10);
  const { data: form, isLoading, isError, refetch } = useFormDetail(formId);

  // State to track the currently selected question
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);

  // Automatically select the first question if none is selected
  useEffect(() => {
    if (form?.questions && form.questions.length > 0 && !activeQuestionId) {
      setActiveQuestionId(form.questions[0].id);
    } else if (form?.questions && form.questions.length === 0) {
      setActiveQuestionId(null);
    }
  }, [form?.questions, activeQuestionId]);

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen flex flex-col">
        <div className="h-14 border-b border-border/40 flex items-center px-4 gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="flex-1 flex">
          <div className="w-64 border-r border-border/60 p-4 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-xl" />
            ))}
          </div>
          <div className="flex-1 p-8 space-y-3 flex items-center justify-center">
             <Skeleton className="h-64 w-[600px] rounded-2xl" />
          </div>
          <div className="w-80 border-l border-border/60" />
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !form) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center">
        <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-destructive"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h3 className="text-lg font-semibold mb-1">Could not load form</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Make sure the backend is running and the form exists.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => refetch()} className="cursor-pointer">
            Try Again
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" className="cursor-pointer">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const activeQuestion = form.questions.find((q) => q.id === activeQuestionId);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <BuilderHeader form={form} />

      {/* Three-panel layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Pages list */}
        <BuilderSidebar 
          formId={formId} 
          questions={form.questions}
          activeQuestionId={activeQuestionId}
          setActiveQuestionId={setActiveQuestionId}
        />

        {/* Center: Live WYSIWYG editor */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#f3f3f5] relative flex flex-col items-center">
          {activeQuestion ? (
            <QuestionEditor 
              question={activeQuestion} 
              formId={formId}
              index={form.questions.findIndex(q => q.id === activeQuestionId)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
              <p>No questions yet.</p>
              <p className="text-sm">Click "Add content" to start building your form.</p>
            </div>
          )}
        </main>

        {/* Right: Settings panel */}
        <aside className="w-80 border-l border-border/60 bg-white hidden lg:flex flex-col">
          {activeQuestion ? (
            <QuestionSettings question={activeQuestion} formId={formId} />
          ) : (
            <div className="p-6 text-center text-muted-foreground text-sm">
              Select a question to view its settings
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
