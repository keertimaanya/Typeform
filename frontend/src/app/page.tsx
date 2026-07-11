import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[100dvh] bg-[#252525] text-white flex flex-col font-sans relative overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-fuchsia-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-violet-600/20 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 sm:px-10 sm:py-6 relative z-10">
        <div className="flex items-center gap-1.5">
          {/* Logo Mark */}
          <div className="flex gap-1 items-center">
            <div className="w-2.5 h-5 bg-white rounded-full" />
            <div className="w-5 h-5 bg-white rounded-md" />
          </div>
          <span className="text-[1.35rem] font-bold tracking-tight ml-1">Typeform</span>
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
            href="/dashboard" 
            className="inline-block bg-white text-[#1a1a1a] font-medium px-8 py-3.5 rounded-lg text-lg transition-transform hover:scale-105 hover:bg-gray-100"
          >
            Get started—it&apos;s free
          </Link>
        </div>
      </main>
    </div>
  );
}
