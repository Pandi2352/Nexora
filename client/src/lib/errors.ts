import { isRouteErrorResponse } from 'react-router-dom'
import { errorDefinitions } from '@/config/errorCodes'
import type { ErrorDefinition, ResolvedError } from '@/types/error'
import { AppError } from './app-error'

const byStatus = new Map(
  Object.values(errorDefinitions)
    .filter((d) => d.status !== undefined)
    .map((d) => [d.status, d]),
)

/** Definition for an HTTP status, falling back to the closest generic error. */
export function getErrorDefinition(status?: number): ErrorDefinition {
  if (status === undefined) return errorDefinitions.UNKNOWN
  const exact = byStatus.get(status)
  if (exact) return exact
  if (status >= 500) return errorDefinitions.SERVER_ERROR
  if (status >= 400) return errorDefinitions.BAD_REQUEST
  return errorDefinitions.UNKNOWN
}

export function fromStatus(status: number): ResolvedError {
  return { definition: getErrorDefinition(status), status }
}

const CHUNK_ERROR = /dynamically imported module|Importing a module script failed|Loading chunk/i
const NETWORK_ERROR = /Failed to fetch|NetworkError|Network Error|Load failed/i

function hasStatusCode(value: unknown): value is { statusCode: number; requestId?: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof Reflect.get(value, 'statusCode') === 'number'
  )
}

/** Normalizes anything thrown (route responses, AppError, API errors, JS errors) for display. */
export function resolveError(error: unknown): ResolvedError {
  if (isRouteErrorResponse(error)) return fromStatus(error.status)
  if (error instanceof Response) return fromStatus(error.status)

  if (error instanceof AppError) {
    return { ...fromStatus(error.status), requestId: error.requestId, message: error.message }
  }

  // Backend error format: { statusCode, code, message, requestId }
  if (hasStatusCode(error)) {
    return { ...fromStatus(error.statusCode), requestId: error.requestId }
  }

  const message = error instanceof Error ? error.message : undefined

  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return { definition: errorDefinitions.NETWORK_ERROR, message }
  }
  if (message && CHUNK_ERROR.test(message)) {
    return { definition: errorDefinitions.CHUNK_LOAD_ERROR, message }
  }
  if (message && NETWORK_ERROR.test(message)) {
    return { definition: errorDefinitions.NETWORK_ERROR, message }
  }

  return { definition: errorDefinitions.UNKNOWN, message }
}
