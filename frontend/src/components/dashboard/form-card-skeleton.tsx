/**
 * Form Card Skeleton — loading placeholder that matches the FormCard shape.
 * Uses shadcn/ui Skeleton for consistent shimmer animations.
 */

import { Skeleton } from "@/components/ui/skeleton";

export function FormCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      {/* Badge */}
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>

      {/* Icon */}
      <Skeleton className="h-10 w-10 rounded-xl mb-3" />

      {/* Title */}
      <Skeleton className="h-5 w-3/4 mb-2" />

      {/* Description */}
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-2/3" />

      {/* Footer */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/50">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

export function FormGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <FormCardSkeleton key={i} />
      ))}
    </div>
  );
}
