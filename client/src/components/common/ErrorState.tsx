import type { ResolvedError } from '@/types/error'
import { ErrorActions } from './ErrorActions'
import { renderErrorIllustration } from './ErrorIllustrations'

interface ErrorStateProps {
  error: ResolvedError
  onRetry?: () => void
}

/** Reusable error screen with centered layout and dedicated SVG illustrations. */
export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const { definition, status, requestId, message } = error
  const showMessage = import.meta.env.DEV && message
  const eyebrow = status ? `Error ${status}` : undefined

  return (
    <div
      role="alert"
      className="flex min-h-[70vh] w-full flex-col items-center justify-center px-4 py-12 text-center"
    >
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="mb-6 flex items-center justify-center">
          {renderErrorIllustration(definition.key, status)}
        </div>

        {eyebrow && (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600 ring-1 ring-inset ring-slate-200">
            {eyebrow}
          </span>
        )}

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {definition.title}
        </h1>

        <p className="mt-2 text-sm text-slate-500 sm:text-base leading-relaxed">
          {definition.description}
        </p>

        <div className="mt-8">
          <ErrorActions actions={definition.actions} onRetry={onRetry} />
        </div>

        {(requestId || showMessage) && (
          <div className="mt-6 text-xs text-slate-400 space-y-1">
            {requestId && (
              <p>
                Request ID: <code className="font-mono text-slate-600">{requestId}</code>
              </p>
            )}
            {showMessage && (
              <p className="font-mono text-red-500 font-medium">{message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
