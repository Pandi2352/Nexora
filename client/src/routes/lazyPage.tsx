import { lazy, Suspense, type ComponentType, type ReactNode } from 'react'
import { RouteLoader } from '@/components/common/RouteLoader'

export interface PreloadableComponent<P extends object> {
  (props: P): ReactNode
  preload: () => Promise<{ default: ComponentType<P> }>
}

/**
 * Code-splits a page with factory caching and preloading support to eliminate
 * jarring transition flashes when navigating between routes.
 */
export function lazyPage<P extends object>(
  factory: () => Promise<{ default: ComponentType<P> }>,
  fallback: ReactNode = <RouteLoader compact message="Loading..." />,
): PreloadableComponent<P> {
  let cachedPromise: Promise<{ default: ComponentType<P> }> | null = null

  const load = () => {
    if (!cachedPromise) {
      cachedPromise = factory()
    }
    return cachedPromise
  }

  const LazyComponent = lazy(load)

  function LazyPage(props: P) {
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }

  LazyPage.preload = load
  return LazyPage
}
