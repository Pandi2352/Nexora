import type { ResolvedError } from '@/types/error'
import { EmptyState } from './EmptyState'
import { ErrorActions } from './ErrorActions'

interface ErrorStateProps {
  error: ResolvedError
  onRetry?: () => void
}

/** Reusable error screen. Use for route errors, error pages and failed data loads. */
export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const { definition, status, requestId, message } = error
  const showMessage = import.meta.env.DEV && message

  return (
    <div role="alert">
      <EmptyState
        icon={definition.icon}
        eyebrow={status ? `Error ${status}` : undefined}
        title={definition.title}
        description={definition.description}
        action={<ErrorActions actions={definition.actions} onRetry={onRetry} />}
        footer={
          (requestId || showMessage) && (
            <>
              {requestId && (
                <p>
                  Request ID: <code className="font-mono">{requestId}</code>
                </p>
              )}
              {showMessage && <p className="mt-1 font-mono text-red-500">{message}</p>}
            </>
          )
        }
      />
    </div>
  )
}
