import { Spinner } from '@/components/ui'

interface RouteLoaderProps {
  message?: string
  fullscreen?: boolean
  compact?: boolean
}

/**
 * Centered route transition loader without blur, shadows, or color glow effects.
 */
export function RouteLoader({
  message = 'Loading...',
  fullscreen = false,
  compact = false,
}: RouteLoaderProps) {
  if (compact) {
    return (
      <div
        role="status"
        aria-label="Loading page"
        className="flex min-h-[280px] w-full flex-1 flex-col items-center justify-center p-6 text-center select-none"
      >
        <Spinner size="lg" variant="brand" label={message} />
        {message && (
          <p className="mt-3 text-xs font-medium tracking-wide uppercase text-slate-400">
            {message}
          </p>
        )}
      </div>
    )
  }

  return (
    <div
      role="status"
      aria-label="Loading page"
      className={
        fullscreen
          ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-white p-6 text-center select-none'
          : 'flex min-h-[calc(100dvh-10rem)] w-full flex-1 flex-col items-center justify-center p-6 text-center select-none'
      }
    >
      <div className="flex flex-col items-center justify-center">
        <Spinner size="xl" variant="brand" label={message} />
        {message && (
          <p className="mt-4 text-xs font-medium tracking-wider uppercase text-slate-500">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
