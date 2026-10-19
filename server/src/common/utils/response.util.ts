import type { ApiResponse } from '../dto/api-response.dto';
import type { PaginationMeta } from '../dto/pagination.dto';

/**
 * Standard utility to wrap successful responses across all Nexora OS controllers.
 */
export function createApiResponse<T>(
  data: T,
  message?: string,
  meta?: PaginationMeta | Record<string, unknown>,
  statusCode = 200,
  requestId?: string,
): ApiResponse<T> {
  return {
    success: true,
    statusCode,
    message,
    data,
    meta,
    requestId,
    timestamp: new Date().toISOString(),
  };
}

export function createPaginationMeta(total: number, page: number, limit: number): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
