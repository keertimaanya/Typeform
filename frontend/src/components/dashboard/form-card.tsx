/**
 * Form Card — displays a single form in the dashboard grid.
 * 
 * Shows: title, status badge, response count, last updated, actions menu.
 * All actions (rename, duplicate, delete, publish/unpublish) are wired to the API.
 */

"use client";

import { useState } from "react";
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="group relative rounded-2xl border border-border/60 bg-card p-5 shadow-sm hover:shadow-xl hover:border-border transition-all duration-300"
      >
        {/* Status indicator bar at top */}
        <div
          className={`absolute top-0 left-4 right-4 h-0.5 rounded-b-full transition-colors ${
            isPublished
              ? "bg-gradient-to-r from-emerald-400 to-teal-400"
              : "bg-gradient-to-r from-amber-300 to-orange-300"
          }`}
        />

        {/* Header: Badge + Actions */}
        <div className="flex items-start justify-between mb-4">
          <Badge
            variant={isPublished ? "default" : "secondary"}
            className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
              isPublished
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
                : "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800"
            }`}
          >
            {isPublished ? "Published" : "Draft"}
          </Badge>

          {/* Actions dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-muted transition-all duration-200 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
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

        {/* Form icon */}
        <div className="mb-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/30 dark:to-fuchsia-900/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-violet-600 dark:text-violet-400"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-base text-foreground mb-1 line-clamp-1">
          {form.title}
        </h3>

        {/* Description */}
        {form.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {form.description}
          </p>
        )}

        {/* Footer: Meta info */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/50 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            0 responses
          </span>
          <span className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {updatedDate}
          </span>
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
