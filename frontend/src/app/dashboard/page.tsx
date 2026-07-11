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
import { useForms } from "@/hooks/useForms";
import { FormCard } from "@/components/dashboard/form-card";
import { FormGridSkeleton } from "@/components/dashboard/form-card-skeleton";
import { CreateFormDialog } from "@/components/dashboard/create-form-dialog";

export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const { data: forms, isLoading, isError, refetch } = useForms();
  const [activeTab, setActiveTab] = useState("Forms");

  // Filter forms by search query (case-insensitive)
  const filteredForms = useMemo(() => {
    if (!forms) return [];
    if (!search.trim()) return forms;
    return forms.filter((form) =>
      form.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [forms, search]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Tabs Header */}
      <div className="flex items-center px-6 border-b border-border pt-2 gap-6">
        {["Forms", "Contacts", "Automations"].map((tab) => (
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
        <button className="pb-3 text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center gap-2">
          Research Flow <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Demo</span>
        </button>
      </div>

      <div className="flex-1 overflow-auto p-8">
        {/* Workspace Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-normal text-slate-900">My workspace</h1>
            <button className="text-slate-400 hover:text-slate-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
            </button>
            <button className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
              Invite
            </button>
            <div className="w-5 h-5 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-center ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm font-medium text-slate-600 border border-border rounded-md px-3 py-1.5 hover:bg-slate-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Date created
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            <div className="flex bg-slate-100 p-0.5 rounded-md border border-border">
              <button className="px-3 py-1 bg-white shadow-sm rounded-sm text-sm font-medium text-slate-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                List
              </button>
              <button className="px-3 py-1 text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                Grid
              </button>
            </div>
          </div>
        </div>

        {/* Search Toolbar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <Input
              placeholder="Search forms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 rounded-lg bg-white border-border"
            />
          </div>
        </div>

        {/* Table Headers */}
        <div className="flex items-center px-4 py-2 text-xs font-medium text-slate-500 mb-2 border-b border-border/50">
          <div className="flex-1"></div>
          <div className="w-24 text-center">Responses</div>
          <div className="w-24 text-center">Completed</div>
          <div className="w-32 text-right">Updated</div>
          <div className="w-24 text-center">Integrations</div>
          <div className="w-12"></div>
        </div>

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
            <div className="flex flex-col gap-2">
              {filteredForms.map((form, index) => (
                <div key={form.id} className="w-full">
                  <FormCard form={form} index={index} />
                </div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
