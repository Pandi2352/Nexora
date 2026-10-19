import axios from 'axios'
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

/**
 * Extracts a user-friendly and actionable error message from any caught error.
 * Handles offline backend, connection refused, Axios responses, validation errors, and fallbacks.
 */
export function getApiErrorMessage(
  error: unknown,
  fallbackMessage = 'An unexpected error occurred. Please try again.',
): string {
  if (axios.isAxiosError(error)) {
    // 1. Backend explicitly returned an error message in its JSON payload
    const data = error.response?.data as { message?: string | string[]; error?: string } | undefined
    if (data?.message) {
      return Array.isArray(data.message) ? data.message.join('. ') : String(data.message)
    }
    if (data?.error) {
      return String(data.error)
    }

    // 2. Server unreachable or offline (e.g. backend server is not running)
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error' || !error.response) {
      return 'Unable to connect to the server. Please verify the backend service is running and try again.'
    }

    // 3. Request timeout
    if (error.code === 'ECONNABORTED' || error.message.toLowerCase().includes('timeout')) {
      return 'Connection timed out. Please check your network and try again.'
    }

    // 4. HTTP status fallbacks
    if (error.response?.status === 401) {
      return 'Invalid credentials or session expired. Please try again.'
    }
    if (error.response?.status === 403) {
      return 'You do not have permission to perform this action.'
    }
    if (error.response?.status === 404) {
      return 'The requested resource could not be found.'
    }
    if (error.response?.status === 409) {
      return 'A conflict occurred. This record may already exist.'
    }
    if (error.response?.status === 429) {
      return 'Too many requests. Please wait a moment and try again.'
    }
    if (error.response && error.response.status >= 500) {
      return 'The server encountered an error. Please try again shortly.'
    }
  }

  if (error instanceof AppError && error.message) {
    return error.message
  }

  if (error instanceof Error && error.message) {
    if (/network|failed to fetch|connection refused|load failed/i.test(error.message)) {
      return 'Unable to connect to the server. Please verify the backend service is running and try again.'
    }
    return error.message
  }

  return fallbackMessage
}

