import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, errorCodeForStatus } from './error-codes';

export interface FieldError {
  field: string;
  message: string;
}

/**
 * Throw from services to return a specific error code and safe message.
 * Example: `throw new AppException(HttpStatus.CONFLICT, 'Slug already in use')`.
 */
export class AppException extends HttpException {
  readonly code: ErrorCode;
  readonly details?: FieldError[];

  constructor(status: HttpStatus, message: string, code?: ErrorCode, details?: FieldError[]) {
    super(message, status);
    this.code = code ?? errorCodeForStatus(status);
    this.details = details;
  }
}
