"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-sm transition-transform group-hover:scale-105">
            T
          </div>
          <span className="text-xl font-bold tracking-tight hidden sm:block">
            Typeform
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
            U
          </div>
        </div>
      </div>
    </header>
  );
}
