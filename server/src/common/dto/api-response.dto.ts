import type { PaginationMeta } from './pagination.dto';

/**
 * Standard envelope for every successful API response across Nexora OS.
 * Guaranteed by createApiResponse() and the global ApiResponseInterceptor.
 */
export interface ApiResponse<T = unknown> {
  success: true;
  statusCode: number;
  message?: string;
  data: T;
  meta?: PaginationMeta | Record<string, unknown>;
  requestId?: string;
  timestamp: string;
}

/**
 * Standard envelope for every error API response across Nexora OS.
 * Emitted by AllExceptionsFilter.
 */
export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  code: string;
  message: string;
  details?: unknown;
  requestId?: string;
  timestamp: string;
}
