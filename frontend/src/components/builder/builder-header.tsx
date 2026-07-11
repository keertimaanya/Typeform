/**
 * Builder Header — top bar with back button, form title, and status.
 */

"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useUpdateForm } from "@/hooks/useForms";
import type { FormDetail } from "@/types/form";

interface BuilderHeaderProps {
  form: FormDetail;
}

export function BuilderHeader({ form }: BuilderHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(form.title);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateForm = useUpdateForm();
  const pathname = usePathname();

  const handleBlur = () => {
    setIsEditing(false);
    if (title.trim() && title.trim() !== form.title) {
      updateForm.mutate({ id: form.id, data: { title: title.trim() } });
    } else {
      setTitle(form.title);
    }
  };

  const isPublished = form.status === "published";
  const isResults = pathname.endsWith("/results");

  return (
    <header className="h-14 border-b border-border/40 bg-background/80 backdrop-blur-xl flex items-center px-4 gap-3 shrink-0">
      {/* Back button */}
      <Link
        href="/dashboard"
        className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
      </Link>

      {/* Divider */}
      <div className="h-5 w-px bg-border/60 shrink-0" />

      {/* Form title — inline editable */}
      <div className="flex-1 flex items-center gap-3 min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === "Enter" && inputRef.current?.blur()}
            className="text-sm font-semibold bg-transparent border-b-2 border-violet-400 outline-none py-1 min-w-[150px]"
            autoFocus
          />
        ) : (
          <button
            onClick={() => {
              setIsEditing(true);
              setTimeout(() => inputRef.current?.focus(), 0);
            }}
            className="text-sm font-semibold hover:text-violet-600 transition-colors cursor-text truncate"
          >
            {form.title}
          </button>
        )}

        {/* Status badge */}
        <Badge
          variant="secondary"
          className={`text-xs rounded-full shrink-0 ${
            isPublished
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
              : "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800"
          }`}
        >
          {isPublished ? "Published" : "Draft"}
        </Badge>
      </div>

      {/* Center Tabs: Create | Results */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center p-1 bg-muted/50 rounded-lg border border-border/40">
        <Link 
          href={`/builder/${form.id}`} 
          className={`px-4 py-1 text-sm font-medium rounded-md transition-colors ${!isResults ? "bg-background text-foreground shadow-sm" : "hover:bg-background/80 hover:text-foreground text-muted-foreground"}`}
        >
          Create
        </Link>
        <Link 
          href={`/builder/${form.id}/results`} 
          className={`px-4 py-1 text-sm font-medium rounded-md transition-colors ${isResults ? "bg-background text-foreground shadow-sm" : "hover:bg-background/80 hover:text-foreground text-muted-foreground"}`}
        >
          Results
        </Link>
      </div>

      {/* Spacer */}
      <div className="flex-1 flex justify-end">
        {/* Question count */}
        <span className="text-xs text-muted-foreground hidden sm:block">
          {form.questions.length} question{form.questions.length !== 1 ? "s" : ""}
        </span>
      </div>
    </header>
  );
}
