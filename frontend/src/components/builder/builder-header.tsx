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
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface BuilderHeaderProps {
  form: FormDetail;
}

export function BuilderHeader({ form }: BuilderHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(form.title);
  const [showPublishModal, setShowPublishModal] = useState(false);
  
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

  const handlePublish = async () => {
    try {
      await updateForm.mutateAsync({ id: form.id, data: { status: "published" } });
      setShowPublishModal(false);
      toast.success("Form published successfully!");
    } catch {
      toast.error("Failed to publish form.");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/f/${form.share_slug}`);
    toast.success("Link copied to clipboard!");
  };

  const isPublished = form.status === "published";
  const isResults = pathname.endsWith("/results");

  return (
    <>
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
              className="text-sm font-semibold bg-transparent border-b-2 border-slate-800 outline-none py-1 min-w-[150px]"
              autoFocus
            />
          ) : (
            <button
              onClick={() => {
                setIsEditing(true);
                setTimeout(() => inputRef.current?.focus(), 0);
              }}
              className="text-sm font-semibold hover:text-slate-600 transition-colors cursor-text truncate"
            >
              {form.title}
            </button>
          )}

          {/* Status badge */}
          <Badge
            variant="secondary"
            className={`text-xs rounded-full shrink-0 ${
              isPublished
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
          >
            {isPublished ? "Published" : "Draft"}
          </Badge>
        </div>

        {/* Center Tabs */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center p-1 bg-muted/50 rounded-lg border border-border/40">
          <Link 
            href={`/builder/${form.id}`} 
            className={`px-4 py-1 text-sm font-medium rounded-md transition-colors ${!isResults ? "bg-background text-foreground shadow-sm" : "hover:bg-background/80 hover:text-foreground text-muted-foreground"}`}
          >
            Create
          </Link>
          <button onClick={() => toast("Design themes coming soon!", { icon: "🎨" })} className="px-4 py-1 text-sm font-medium rounded-md hover:bg-background/80 hover:text-foreground text-muted-foreground transition-colors">
            Design
          </button>
          <button onClick={() => toast("Advanced settings coming soon!", { icon: "⚙️" })} className="px-4 py-1 text-sm font-medium rounded-md hover:bg-background/80 hover:text-foreground text-muted-foreground transition-colors">
            Settings
          </button>
          <Link 
            href={`/builder/${form.id}/results`} 
            className={`px-4 py-1 text-sm font-medium rounded-md transition-colors ${isResults ? "bg-background text-foreground shadow-sm" : "hover:bg-background/80 hover:text-foreground text-muted-foreground"}`}
          >
            Results
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex-1 flex justify-end items-center gap-3">
          {isPublished && (
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 text-sm font-medium bg-muted text-muted-foreground rounded hover:bg-muted/80 transition-colors active:scale-95 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
              Copy Link
            </button>
          )}
          
          <button
            onClick={() => setShowPublishModal(true)}
            className="px-4 py-1.5 text-sm font-medium bg-slate-900 text-white rounded hover:bg-slate-800 transition-colors shadow-sm active:scale-95 flex items-center gap-2"
          >
            {updateForm.isPending ? (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              isPublished ? "Republish" : "Publish"
            )}
          </button>
        </div>
      </header>

      {/* Publish Modal Overlay */}
      <AnimatePresence>
        {showPublishModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setShowPublishModal(false)}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-background border shadow-2xl rounded-2xl w-full max-w-md flex flex-col overflow-hidden" 
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 text-center">
                <div className="mx-auto h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-900"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                </div>
                <h3 className="font-semibold text-xl mb-2">Publish your form?</h3>
                <p className="text-muted-foreground mb-6">
                  {isPublished ? "This will update your live form with the latest changes." : "Your form will become accessible to anyone with the link."}
                </p>
                <div className="flex gap-3 justify-center">
                  <button onClick={() => setShowPublishModal(false)} className="px-5 py-2.5 bg-muted text-muted-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors">
                    Cancel
                  </button>
                  <button onClick={handlePublish} disabled={updateForm.isPending} className="px-5 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-md disabled:opacity-50 flex items-center gap-2">
                    {updateForm.isPending ? "Publishing..." : "Yes, Publish"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
