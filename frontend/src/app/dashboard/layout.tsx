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


        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
