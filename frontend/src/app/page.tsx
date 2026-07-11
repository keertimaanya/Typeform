import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[100dvh] bg-[#1a1a1a] text-white flex flex-col font-sans relative overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-fuchsia-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-violet-600/20 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 sm:px-10 sm:py-6 relative z-10">
        <div className="flex items-center gap-2">
          {/* Mock Logo */}
          <div className="flex gap-[2px]">
            <div className="w-2.5 h-5 bg-white rounded-l-full" />
            <div className="w-4 h-5 bg-white rounded-r-full" />
          </div>
          <span className="text-xl font-medium tracking-tight">Typeform</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-gray-300 transition-colors">
            Log in
          </Link>
          <Link 
            href="/signup" 
            className="text-sm font-medium bg-white text-[#1a1a1a] px-4 py-2 rounded transition-transform hover:scale-105"
          >
            Sign up
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative z-10 mt-10 sm:mt-0">
        <div className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-fuchsia-300 mb-6">
          AI Forms & Workflows
        </div>
        
        <h1 className="text-5xl sm:text-7xl md:text-[5.5rem] font-medium leading-[1.05] tracking-tight max-w-4xl font-serif">
          The form is only <br className="hidden sm:block" />
          <span className="text-fuchsia-300 italic pr-4">the</span> beginning
        </h1>
        
        <p className="mt-8 text-lg sm:text-xl text-gray-300 max-w-2xl font-light">
          Collect, analyze, and act on customer data <br className="hidden sm:block" />
          with the complete platform for AI forms & workflows.
        </p>
        
        <div className="mt-10">
          <Link 
            href="/signup" 
            className="inline-block bg-white text-[#1a1a1a] font-medium px-8 py-3.5 rounded-lg text-lg transition-transform hover:scale-105 hover:bg-gray-100"
          >
            Get started—it&apos;s free
          </Link>
        </div>
      </main>

      {/* Bottom Mock Cards */}
      <div className="w-full flex gap-6 px-6 pb-0 pt-20 overflow-hidden opacity-80 relative z-10 justify-center translate-y-12">
        <div className="w-80 h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-t-3xl border border-gray-700/50 p-6 flex flex-col justify-end relative overflow-hidden">
          <div className="absolute inset-0 bg-fuchsia-500/10" />
          <p className="text-sm font-medium relative z-10">Build a lead generation form for my business FitCo...</p>
        </div>
        <div className="w-[450px] h-72 bg-[#2d2d2d] rounded-t-3xl border border-gray-700/50 p-2 shadow-2xl relative">
          <div className="w-full h-full bg-[#1a1a1a] rounded-t-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/40 to-orange-600/40" />
            <div className="absolute bottom-0 w-full h-3/4 bg-white rounded-t-2xl p-4 shadow-xl translate-y-8" />
          </div>
        </div>
        <div className="w-80 h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-t-3xl border border-gray-700/50 p-6 flex flex-col justify-end relative overflow-hidden hidden lg:flex">
          <div className="absolute inset-0 bg-violet-500/10" />
          <p className="text-sm font-medium relative z-10">Create an interactive quiz...</p>
        </div>
      </div>
    </div>
  );
}
