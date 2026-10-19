import type { ApiResponse } from '../dto/api-response.dto';
import type { PaginationMeta } from '../dto/pagination.dto';

/** Wraps every successful controller response. */
export function createApiResponse<T>(
  data: T,
  message?: string,
  meta?: PaginationMeta | Record<string, unknown>,
): ApiResponse<T> {
  return { success: true, message, data, meta };
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
