/**
 * Client-side providers wrapper.
 * 
 * Next.js App Router uses Server Components by default.
 * TanStack Query needs React context (client-side only).
 * This file wraps the app in the QueryClientProvider.
 * 
 * "use client" tells Next.js this component runs in the browser.
 */

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  // Create QueryClient inside useState so it's created once per component mount
  // (not on every re-render)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000, // Data is "fresh" for 30 seconds
            retry: 1,             // Retry failed requests once
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster richColors position="bottom-right" />
    </QueryClientProvider>
  );
}
