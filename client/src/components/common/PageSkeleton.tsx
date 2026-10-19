import { Skeleton } from '@/components/ui'

/** Suspense fallback while a lazy page loads. Mirrors PageHeader + content. */
export function PageSkeleton() {
  return (
    <div role="status" aria-label="Loading page">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="mt-2 h-4 w-72" />
      <Skeleton className="mt-6 h-64 w-full" />
    </div>
  )
}
