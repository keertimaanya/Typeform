/**
 * Form Card — displays a single form in the dashboard grid.
 * 
 * Shows: title, status badge, response count, last updated, actions menu.
 * All actions (rename, duplicate, delete, publish/unpublish) are wired to the API.
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  useDeleteForm,
  useDuplicateForm,
  usePublishForm,
  useUnpublishForm,
} from "@/hooks/useForms";
import { toast } from "sonner";
import { RenameFormDialog } from "./rename-form-dialog";
import type { Form } from "@/types/form";

interface FormCardProps {
  form: Form;
  index: number;
}

export function FormCard({ form, index }: FormCardProps) {
  const [showRename, setShowRename] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const deleteForm = useDeleteForm();
  const duplicateForm = useDuplicateForm();
  const publishForm = usePublishForm();
  const unpublishForm = useUnpublishForm();

  const isPublished = form.status === "published";
  const updatedDate = new Date(form.updated_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleDuplicate = async () => {
    try {
      await duplicateForm.mutateAsync(form.id);
      toast.success(`Duplicated "${form.title}"`);
    } catch {
      toast.error("Failed to duplicate form");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteForm.mutateAsync(form.id);
      toast.success(`Deleted "${form.title}"`);
    } catch {
      toast.error("Failed to delete form");
    }
  };

  const handleTogglePublish = async () => {
    try {
      if (isPublished) {
        await unpublishForm.mutateAsync(form.id);
        toast.success("Form unpublished");
      } else {
        await publishForm.mutateAsync(form.id);
        toast.success("Form published!");
      }
    } catch (err: unknown) {
      const message =
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "detail" in err.response.data
          ? String(err.response.data.detail)
          : "Failed to update form status";
      toast.error(message);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: index * 0.05 }}
        whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
        className="group relative flex items-center px-4 py-3 bg-white border-b border-border/50 transition-colors"
      >
        {/* Left side: Icon + Title */}
        <div className="flex items-center flex-1 gap-4">
          <Link href={`/builder/${form.id}`} className="flex items-center gap-4 flex-1">
            <div className="h-10 w-10 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
            </div>
            <div>
              <h3 className="font-medium text-sm text-slate-900 group-hover:text-primary transition-colors">
                {form.title}
              </h3>
            </div>
          </Link>
        </div>

        {/* Responses */}
        <div className="w-24 text-center text-sm text-slate-500">
          -
        </div>

        {/* Completed */}
        <div className="w-24 text-center text-sm text-slate-500">
          -
        </div>

        {/* Updated */}
        <div className="w-32 text-right text-sm text-slate-500">
          {updatedDate}
        </div>

        {/* Integrations */}
        <div className="w-24 flex items-center justify-center gap-1 text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="8" x="2" y="2" rx="2"/><rect width="8" height="8" x="14" y="2" rx="2"/><rect width="8" height="8" x="2" y="14" rx="2"/><path d="M14 14h8v8h-8z"/></svg>
        </div>

        {/* Actions Dropdown */}
        <div className="w-12 flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 hover:bg-slate-100 transition-all cursor-pointer text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setShowRename(true)} className="cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate} className="cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleTogglePublish} className="cursor-pointer">
                {isPublished ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    Unpublish
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m5 12 5 5L20 7"/></svg>
                    Publish
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDelete(true)}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      {/* Rename Dialog */}
      <RenameFormDialog
        open={showRename}
        onOpenChange={setShowRename}
        formId={form.id}
        currentTitle={form.title}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete form?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{form.title}&quot; and all its responses. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90 cursor-pointer"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
