"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreateFormDialog } from "./create-form-dialog";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r border-border bg-white flex flex-col h-full shrink-0">
      <div className="p-4">
        <CreateFormDialog />
      </div>

      <div className="px-4 py-2">
        <div className="relative">
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
          <input
            type="text"
            placeholder="Search"
            className="w-full h-8 pl-8 pr-3 rounded-md border border-border bg-muted/30 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-4">
        <div className="flex items-center justify-between px-2 mb-2 text-sm text-slate-800 font-medium">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
            Workspaces
          </div>
          <button className="text-slate-400 hover:text-slate-800 transition-colors">+</button>
        </div>
        
        <div className="space-y-0.5">
          <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mt-4 mb-1">
            Private
          </div>
          <Link 
            href="/dashboard"
            className={`flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors ${pathname === '/dashboard' ? 'bg-muted font-medium text-slate-900' : 'text-slate-600 hover:bg-muted/50'}`}
          >
            <span className="truncate">My workspace</span>
            <span className="text-xs text-slate-400">1</span>
          </Link>
        </div>
      </div>

      {/* Footer limit widget */}
      <div className="p-4 border-t border-border mt-auto">
        <div className="text-xs font-medium text-slate-500 mb-2">Responses collected</div>
        <div className="flex items-end justify-between mb-2">
          <div className="text-sm font-semibold text-slate-800">0 <span className="text-slate-400 font-normal">/ 10</span></div>
        </div>
        <div className="w-full h-1 bg-slate-100 rounded-full mb-3">
          <div className="w-0 h-full bg-emerald-500 rounded-full" />
        </div>
        <button className="w-full py-1.5 px-3 rounded-md border border-border text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center">
          Increase response limit
        </button>
      </div>
    </div>
  );
}
