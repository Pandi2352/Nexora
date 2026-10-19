import type { LucideIcon } from 'lucide-react'

export type ErrorKey =
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'REQUEST_TIMEOUT'
  | 'CONFLICT'
  | 'GONE'
  | 'PAYLOAD_TOO_LARGE'
  | 'UNPROCESSABLE'
  | 'TOO_MANY_REQUESTS'
  | 'SERVER_ERROR'
  | 'BAD_GATEWAY'
  | 'SERVICE_UNAVAILABLE'
  | 'GATEWAY_TIMEOUT'
  | 'NETWORK_ERROR'
  | 'CHUNK_LOAD_ERROR'
  | 'UNKNOWN'

/** Buttons offered on an error screen. */
export type ErrorAction = 'retry' | 'reload' | 'back' | 'home' | 'login'

export interface ErrorDefinition {
  key: ErrorKey
  /** HTTP status; absent for client-side errors (network, chunk load). */
  status?: number
  title: string
  description: string
  icon: LucideIcon
  actions: ErrorAction[]
}

/** An error normalized for display. */
export interface ResolvedError {
  definition: ErrorDefinition
  status?: number
  /** API correlation ID, shown so users can quote it to support. */
  requestId?: string
  /** Raw message, shown in development only. */
  message?: string
}
