/**
 * Dashboard Page — the main page showing all forms.
 * 
 * Features:
 * - Search bar to filter forms by title
 * - Create form button
 * - Grid of form cards with actions
 * - Loading state (skeleton shimmer)
 * - Empty state (no forms yet)
 * - Error state (backend unreachable)
 */

"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForms } from "@/hooks/useForms";
import { FormCard } from "@/components/dashboard/form-card";
import { FormGridSkeleton } from "@/components/dashboard/form-card-skeleton";
import { CreateFormDialog } from "@/components/dashboard/create-form-dialog";

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const { data: forms, isLoading, isError, refetch } = useForms();

  // Filter forms by search query (case-insensitive)
  const filteredForms = useMemo(() => {
    if (!forms) return [];
    if (!search.trim()) return forms;
    return forms.filter((form) =>
      form.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [forms, search]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold tracking-tight mb-1"
        >
          My Forms
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground"
        >
          Create, manage, and track your forms
        </motion.p>
      </div>

      {/* Toolbar: Search + Create */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-col sm:flex-row gap-3 mb-8"
      >
        <div className="relative flex-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <Input
            placeholder="Search forms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-muted/50 border-transparent focus:border-border focus:bg-background transition-colors"
          />
        </div>
        <CreateFormDialog />
      </motion.div>

      {/* Content */}
      {isLoading ? (
        <FormGridSkeleton />
      ) : isError ? (
        /* Error State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-destructive"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h3 className="text-lg font-semibold mb-1">Unable to load forms</h3>
          <p className="text-muted-foreground text-sm mb-4 max-w-sm">
            Could not connect to the server. Make sure the backend is running on port 8000.
          </p>
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="rounded-xl cursor-pointer"
          >
            Try Again
          </Button>
        </motion.div>
      ) : filteredForms.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/20 dark:to-fuchsia-900/20 flex items-center justify-center mb-5 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-violet-500"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
          </div>
          {search.trim() ? (
            <>
              <h3 className="text-lg font-semibold mb-1">No forms found</h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                No forms match &quot;{search}&quot;. Try a different search term.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold mb-1">No forms yet</h3>
              <p className="text-muted-foreground text-sm mb-5 max-w-sm">
                Get started by creating your first form. It only takes a few seconds.
              </p>
              <CreateFormDialog />
            </>
          )}
        </motion.div>
      ) : (
        /* Form Grid */
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredForms.map((form, index) => (
              <FormCard key={form.id} form={form} index={index} />
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
