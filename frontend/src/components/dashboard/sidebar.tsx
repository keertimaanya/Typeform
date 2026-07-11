"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CreateFormDialog } from "./create-form-dialog";
import { useForms } from "@/hooks/useForms";

// Highlights the matching part of text in bold
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <strong className="font-semibold">{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </span>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: forms } = useForms();

  // Search modal state
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Workspace + tooltip
  const [showWorkspaceTip, setShowWorkspaceTip] = useState(false);
  const workspaceTipRef = useRef<HTMLDivElement>(null);

  // Close workspace tooltip when clicking outside
  useEffect(() => {
    if (!showWorkspaceTip) return;
    const handler = (e: MouseEvent) => {
      if (workspaceTipRef.current && !workspaceTipRef.current.contains(e.target as Node)) {
        setShowWorkspaceTip(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showWorkspaceTip]);

  // Close search on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowSearch(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Auto-focus search input when modal opens
  useEffect(() => {
    if (showSearch) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery("");
    }
  }, [showSearch]);

  const filteredForms = useMemo(() => {
    if (!forms || !searchQuery.trim()) return [];
    return forms.filter((f) =>
      f.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [forms, searchQuery]);

  const formCount = forms?.length ?? 0;

  return (
    <>
      <div className="w-64 border-r border-border bg-white flex flex-col h-full shrink-0">
        <div className="p-4">
          <CreateFormDialog />
        </div>

        {/* Search button (opens modal) */}
        <div className="px-4 py-2">
          <button
            onClick={() => setShowSearch(true)}
            className="w-full h-8 pl-8 pr-3 rounded-md border border-border bg-muted/30 text-sm text-slate-400 hover:bg-muted/50 transition-all flex items-center gap-2 relative cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            Search
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-4">
          {/* Workspaces header with + button */}
          <div className="relative">
            <div className="flex items-center justify-between px-2 mb-2 text-sm text-slate-800 font-medium">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                Workspaces
              </div>
              <button
                onClick={() => setShowWorkspaceTip((v) => !v)}
                className="h-5 w-5 flex items-center justify-center rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer text-base font-light"
              >
                +
              </button>
            </div>

            {/* Create workspace tooltip */}
            <AnimatePresence>
              {showWorkspaceTip && (
                <motion.div
                  ref={workspaceTipRef}
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 top-8 z-30 bg-white rounded-xl shadow-lg border border-border p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-7 w-7 rounded-md bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-slate-600 font-medium text-lg leading-none">+</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Create workspace</p>
                      <p className="text-xs text-slate-500 mt-0.5">Share it with your team or keep it private.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Private workspaces list */}
          <div className="space-y-0.5">
            <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-4 mb-1">
              Private
            </div>
            <Link
              href="/dashboard"
              className={`flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors ${
                pathname === "/dashboard"
                  ? "bg-muted font-medium text-slate-900"
                  : "text-slate-600 hover:bg-muted/50"
              }`}
            >
              <span className="truncate">My workspace</span>
              <span className="text-xs text-slate-400">{formCount}</span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border mt-auto">
          <div className="text-xs font-medium text-slate-500 mb-2">Responses collected</div>
          <div className="flex items-end justify-between mb-2">
            <div className="text-sm font-semibold text-slate-800">
              0 <span className="text-slate-400 font-normal">/ ∞</span>
            </div>
          </div>
          <div className="w-full h-1 bg-slate-100 rounded-full mb-3">
            <div className="w-0 h-full bg-emerald-500 rounded-full" />
          </div>
        </div>
      </div>

      {/* ── Search Modal ── */}
      <AnimatePresence>
        {showSearch && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowSearch(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.18 }}
              className="fixed left-1/2 top-32 -translate-x-1/2 z-50 w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-border overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-5 pb-3">
                <h2 className="text-xl font-semibold text-slate-900">Search</h2>
                <button
                  onClick={() => setShowSearch(false)}
                  className="h-7 w-7 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>

              {/* Input */}
              <div className="px-6 pb-3">
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search forms..."
                  className="w-full h-11 px-4 rounded-xl border-2 border-border bg-slate-50 text-slate-900 text-sm outline-none focus:border-primary/40 transition-colors placeholder:text-slate-400"
                />
              </div>

              {/* Results */}
              <div className="px-6 pb-6 min-h-[80px]">
                {!searchQuery.trim() ? null : filteredForms.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-2xl font-light text-slate-800 mb-1">No results found</p>
                    <p className="text-sm text-slate-400">Try again using other search terms.</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Forms</p>
                    <div className="space-y-1">
                      {filteredForms.map((form) => (
                        <button
                          key={form.id}
                          onClick={() => {
                            setShowSearch(false);
                            router.push(`/builder/${form.id}`);
                          }}
                          className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-slate-100 transition-colors text-sm text-slate-800 cursor-pointer"
                        >
                          <HighlightMatch text={form.title} query={searchQuery} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
