/**
 * Standard API response envelope mirrored from Nexora OS server.
 */
export interface ApiResponse<T = unknown> {
  success: true
  statusCode: number
  message?: string
  data: T
  meta?: PaginationMeta | Record<string, unknown>
  requestId?: string
  timestamp: string
}

/**
 * Standard API error envelope mirrored from Nexora OS server.
 */
export interface ApiErrorResponse {
  success: false
  statusCode: number
  code: string
  message: string
  details?: Array<{ field?: string; message: string }>
  requestId?: string
  timestamp: string
}

/**
 * Standard pagination metadata for paginated collection responses.
 */
export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}
