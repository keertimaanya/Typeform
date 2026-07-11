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



        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
