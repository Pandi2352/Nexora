import { lazy, Suspense, type ComponentType } from 'react'
import { PageSkeleton } from '@/components/common/PageSkeleton'

/**
 * Code-splits a page. The Suspense boundary sits inside the layout's <Outlet />,
 * so the sidebar and navbar stay visible while the page chunk loads.
 * Call at module level (in routes/pages.ts), never inside a component.
 */
export function lazyPage<P extends object>(factory: () => Promise<{ default: ComponentType<P> }>) {
  const LazyComponent = lazy(factory)

  return function LazyPage(props: P) {
    return (
      <Suspense fallback={<PageSkeleton />}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}
