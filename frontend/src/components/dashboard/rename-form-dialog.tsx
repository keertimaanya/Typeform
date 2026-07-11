/**
 * Rename Form Dialog — inline rename via a modal.
 */

"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUpdateForm } from "@/hooks/useForms";
import { toast } from "sonner";

interface RenameFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formId: number;
  currentTitle: string;
}

export function RenameFormDialog({
  open,
  onOpenChange,
  formId,
  currentTitle,
}: RenameFormDialogProps) {
  const [title, setTitle] = useState(currentTitle);
  const updateForm = useUpdateForm();

  // Sync title when dialog opens with a different form
  useEffect(() => {
    if (open) setTitle(currentTitle);
  }, [open, currentTitle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || title.trim() === currentTitle) {
      onOpenChange(false);
      return;
    }

    try {
      await updateForm.mutateAsync({ id: formId, data: { title: title.trim() } });
      toast.success("Form renamed!");
      onOpenChange(false);
    } catch {
      toast.error("Failed to rename form");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Rename form</DialogTitle>
            <DialogDescription>
              Enter a new title for your form.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 text-base"
              autoFocus
              onFocus={(e) => e.target.select()}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || updateForm.isPending}
              className="cursor-pointer"
            >
              {updateForm.isPending ? (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
