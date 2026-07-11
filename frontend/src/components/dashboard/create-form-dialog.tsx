/**
 * Create Form Dialog — opens a modal to create a new form.
 */

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateForm } from "@/hooks/useForms";
import { toast } from "sonner";

export function CreateFormDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const createForm = useCreateForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createForm.mutateAsync({ title: title.trim() });
      toast.success("Form created successfully!");
      setTitle("");
      setOpen(false);
    } catch {
      toast.error("Failed to create form");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            size="lg"
            className="gap-2 rounded-xl shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-200 cursor-pointer"
          />
        }
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
        New Form
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a new form</DialogTitle>
            <DialogDescription>
              Give your form a title. You can always change it later.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <Input
              placeholder="e.g. Customer Feedback Survey"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 text-base"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || createForm.isPending}
              className="cursor-pointer"
            >
              {createForm.isPending ? "Creating..." : "Create Form"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
