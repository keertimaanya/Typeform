"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const router = useRouter();

  // Mock signup: just go to dashboard immediately
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col flex-1 p-8 sm:p-12 md:p-16 relative">
      {/* Top right language & link */}
      <div className="flex justify-between items-center mb-16">
        <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
          English
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        <div className="text-sm">
          <span className="text-gray-500 mr-2">Already have an account?</span>
          <Link href="/login" className="border border-gray-200 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors">
            Log in
          </Link>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex gap-[2px]">
            <div className="w-3.5 h-6 bg-slate-900 rounded-l-full" />
            <div className="w-5 h-6 bg-slate-900 rounded-r-full" />
          </div>
          <span className="text-2xl font-medium tracking-tight">Typeform</span>
        </div>

        <h1 className="text-[26px] font-light text-center leading-tight mb-10 text-slate-800">
          Get better data with conversational forms, surveys, quizzes and more.
        </h1>

        <div className="w-full space-y-4">
          <Button variant="outline" className="w-full h-12 rounded-lg text-base font-normal flex items-center justify-center gap-3 cursor-pointer" onClick={handleSignup}>
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
            Sign up with Google
          </Button>
          <Button variant="outline" className="w-full h-12 rounded-lg text-base font-normal flex items-center justify-center gap-3 cursor-pointer" onClick={handleSignup}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 21 21"><path fill="#f25022" d="M0 0h10v10H0z"/><path fill="#7fba00" d="M11 0h10v10H11z"/><path fill="#00a4ef" d="M0 11h10v10H0z"/><path fill="#ffb900" d="M11 11h10v10H11z"/></svg>
            Sign up with Microsoft
          </Button>
          
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400">OR</span>
            </div>
          </div>

          <Button className="w-full h-12 rounded-lg text-base font-normal bg-[#332c39] hover:bg-[#252029] cursor-pointer" onClick={handleSignup}>
            Sign up with email
          </Button>
        </div>
      </div>
    </div>
  );
}
