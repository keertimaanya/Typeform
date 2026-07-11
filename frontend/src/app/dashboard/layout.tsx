import { Sidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[100dvh] w-full bg-[#fcfcfc] overflow-hidden font-sans">
      {/* Typeform AI Collapsed Panel Mock */}
      <div className="w-14 border-r border-border bg-white flex flex-col items-center py-4 shrink-0 shadow-sm z-20">
        <div className="w-8 h-8 rounded-lg bg-fuchsia-100 flex items-center justify-center text-fuchsia-600 mb-8 cursor-pointer hover:bg-fuchsia-200 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>
        </div>
      </div>

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Top Header */}
        <header className="h-16 border-b border-border bg-white flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-rose-300 text-rose-900 flex items-center justify-center font-medium text-sm">
              K
            </div>
            <span className="text-sm font-medium text-slate-700">keertimaanya06138</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="m6 9 6 6 6-6"/></svg>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="8" x="2" y="2" rx="2"/><rect width="8" height="8" x="14" y="2" rx="2"/><rect width="8" height="8" x="2" y="14" rx="2"/><rect width="8" height="8" x="14" y="14" rx="2"/></svg>
              Integrations
            </button>
            <button className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              Brand kit
            </button>
            <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
            </button>
            <div className="w-8 h-8 rounded-full bg-rose-300 text-rose-900 flex items-center justify-center font-medium text-sm">
              K
            </div>
          </div>
        </header>

        {/* Promo Banner */}
        <div className="px-6 pt-4 pb-0">
          <div className="w-full bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex items-center justify-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600"><path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2"/></svg>
            <span className="text-sm text-slate-800">You can collect <strong>10 form responses</strong> this month for free.</span>
            <button className="text-xs bg-emerald-700 text-white px-3 py-1.5 rounded hover:bg-emerald-800 transition-colors font-medium">Get more responses</button>
            <button className="ml-auto text-emerald-600 hover:text-emerald-800">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
