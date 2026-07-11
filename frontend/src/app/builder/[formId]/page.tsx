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

import { use } from "react";
import { useFormDetail } from "@/hooks/useBuilder";
import { BuilderHeader } from "@/components/builder/builder-header";
import { BuilderSidebar } from "@/components/builder/builder-sidebar";
import { QuestionList } from "@/components/builder/question-list";
import { LivePreview } from "@/components/builder/live-preview";
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
          <div className="flex-1 p-8 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl" />
            ))}
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

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <BuilderHeader form={form} />

      {/* Three-panel layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Question type sidebar */}
        <BuilderSidebar formId={formId} />

        {/* Center: Question editor */}
        <main className="flex-1 overflow-y-auto p-6 bg-muted/20">
          <div className="max-w-2xl mx-auto">
            <QuestionList questions={form.questions} formId={formId} />
          </div>
        </main>

        {/* Right: Live preview */}
        <aside className="w-80 border-l border-border/60 bg-background hidden lg:flex flex-col">
          <LivePreview questions={form.questions} formTitle={form.title} />
        </aside>
      </div>
    </div>
  );
}
