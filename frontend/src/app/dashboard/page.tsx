"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { useForms } from "@/hooks/useForms";
import { FormCard } from "@/components/dashboard/form-card";
import { FormGridSkeleton } from "@/components/dashboard/form-card-skeleton";
import { CreateFormDialog } from "@/components/dashboard/create-form-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ViewMode = "list" | "grid";

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const { data: forms, isLoading, isError, refetch } = useForms();
  const [activeTab, setActiveTab] = useState("Forms");

  const filteredForms = useMemo(() => {
    if (!forms) return [];
    if (!search.trim()) return forms;
    return forms.filter((form) =>
      form.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [forms, search]);

  const [workspaceName, setWorkspaceName] = useState("My workspace");
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState(workspaceName);

  const handleRenameWorkspace = () => {
    if (newWorkspaceName.trim()) {
      setWorkspaceName(newWorkspaceName.trim());
      setShowRenameDialog(false);
      toast.success("Workspace renamed");
    }
  };

  const handleLeaveWorkspace = () => {
    toast.error("You cannot leave your default workspace.");
  };

  const handleDeleteWorkspace = () => {
    toast.error("You cannot delete your default workspace.");
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Tabs Header */}
      <div className="flex items-center px-6 border-b border-border pt-2 gap-6">
        {["Forms"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === tab ? "text-slate-900" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-8">
        {/* Workspace Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-normal text-slate-900">{workspaceName}</h1>
            <DropdownMenu>
              <DropdownMenuTrigger className="h-8 w-8 rounded flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors outline-none cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                <DropdownMenuItem onClick={() => {
                  setNewWorkspaceName(workspaceName);
                  setShowRenameDialog(true);
                }} className="cursor-pointer">
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLeaveWorkspace} className="cursor-pointer">
                  Leave
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteWorkspace} className="text-destructive focus:text-destructive cursor-pointer">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-4">
            {/* View toggle */}
            <div className="flex bg-slate-100 p-0.5 rounded-md border border-border">
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1 rounded-sm text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white shadow-sm text-slate-800"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                List
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1 rounded-sm text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-slate-800"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                Grid
              </button>
            </div>
          </div>
        </div>



        {/* List view column headers */}
        {viewMode === "list" && (
          <div className="flex items-center px-4 py-2 text-xs font-medium text-slate-500 mb-2 border-b border-border/50">
            <div className="flex-1"></div>
            <div className="w-24 text-center">Responses</div>
            <div className="w-24 text-center">Status</div>
            <div className="w-32 text-right">Updated</div>
            <div className="w-12"></div>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <FormGridSkeleton />
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-lg font-semibold mb-1">Unable to load forms</h3>
            <button onClick={() => refetch()} className="text-primary hover:underline">Try Again</button>
          </div>
        ) : filteredForms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h3 className="text-lg font-semibold mb-1">No forms yet</h3>
            <p className="text-muted-foreground text-sm mb-5">Create your first form to get started.</p>
            <CreateFormDialog />
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {viewMode === "list" ? (
              <div className="flex flex-col gap-0">
                {filteredForms.map((form, index) => (
                  <FormCard key={form.id} form={form} index={index} viewMode="list" />
                ))}
              </div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
              >
                {filteredForms.map((form, index) => (
                  <FormCard key={form.id} form={form} index={index} viewMode="grid" />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Rename Workspace Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename workspace</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              placeholder="Workspace name"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleRenameWorkspace();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameDialog(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button onClick={handleRenameWorkspace} className="cursor-pointer">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
