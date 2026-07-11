"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FormDetail } from "@/types/form";
import { FormViewer } from "@/components/respondent/form-viewer";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: FormDetail;
}

export function PreviewModal({ isOpen, onClose, form }: PreviewModalProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [viewerKey, setViewerKey] = useState(0); // Used to restart the preview

  if (!isOpen) return null;

  const handleRestart = () => {
    setViewerKey((prev) => prev + 1);
  };

  const mockSubmit = async (payload: any) => {
    // In preview mode, we just simulate a tiny delay and succeed
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("Simulated submission:", payload);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex flex-col bg-slate-100/80 backdrop-blur-md">
        {/* Top Control Bar */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="h-14 bg-white border-b border-border/40 flex items-center justify-between px-4 shrink-0 shadow-sm"
        >
          {/* Left spacer for balance */}
          <div className="w-20"></div>

          {/* Center controls */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setIsMobile(false)}
              className={`p-1.5 rounded-md transition-colors flex items-center gap-2 px-3 text-sm font-medium cursor-pointer ${
                !isMobile ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="20" height="14" x="2" y="5" rx="2"/></svg>
              Desktop
            </button>
            <button
              onClick={() => setIsMobile(true)}
              className={`p-1.5 rounded-md transition-colors flex items-center gap-2 px-3 text-sm font-medium cursor-pointer ${
                isMobile ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
              Mobile
            </button>
          </div>

          {/* Right controls */}
          <div className="flex items-center justify-end w-20 gap-2">
            <button
              onClick={handleRestart}
              title="Restart preview"
              className="h-8 w-8 rounded hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>
            <button
              onClick={onClose}
              title="Close preview"
              className="h-8 w-8 rounded hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        </motion.div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative flex items-center justify-center p-4">
          <motion.div
            layout
            transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
            className={`bg-white shadow-2xl relative overflow-hidden flex flex-col ${
              isMobile 
                ? "w-[375px] h-[812px] max-h-full rounded-[3rem] border-8 border-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.15)] ring-1 ring-slate-900/10" 
                : "w-full h-full rounded-2xl border border-border/40"
            }`}
          >
            {/* Fake mobile notch for aesthetics */}
            {isMobile && (
              <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-[200]">
                <div className="w-32 h-6 bg-slate-900 rounded-b-2xl"></div>
              </div>
            )}
            
            <div className="flex-1 w-full h-full relative z-0">
              <FormViewer
                key={viewerKey}
                form={form}
                onSubmit={mockSubmit}
                isPending={false}
                isPreview={true}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
