import type { PaginationMeta } from './pagination.dto';

/** Envelope for every successful response. Errors use ErrorBody instead. */
export interface ApiResponse<T> {
  success: true;
  message?: string;
  data: T;
  meta?: PaginationMeta | Record<string, unknown>;
}
