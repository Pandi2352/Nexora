import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AppException, type FieldError } from './app.exception';
import { ErrorCode, errorCodeForStatus } from './error-codes';

/** Standard error body matching ApiResponse top-level structure. */
export interface ErrorBody {
  success: false;
  statusCode: number;
  code: ErrorCode;
  message: string;
  details?: FieldError[];
  requestId?: string;
  timestamp: string;
}

const SAFE_SERVER_MESSAGE = 'An unexpected error occurred. Please try again later.';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly exposeServerErrors: boolean) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const body = this.toBody(exception, request.requestId);

    if (body.statusCode >= 500) {
      this.logger.error(
        `[${request.requestId}] ${request.method} ${request.originalUrl} → ${body.statusCode}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(body.statusCode).json(body);
  }

  private toBody(exception: unknown, requestId?: string): ErrorBody {
    const timestamp = new Date().toISOString();

    if (exception instanceof AppException) {
      return {
        success: false,
        statusCode: exception.getStatus(),
        code: exception.code,
        message: exception.message,
        details: exception.details,
        requestId,
        timestamp,
      };
    }

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const res = exception.getResponse();
      const message =
        typeof res === 'string'
          ? res
          : String((res as { message?: unknown }).message ?? exception.message);
      return {
        success: false,
        statusCode,
        code: errorCodeForStatus(statusCode),
        message,
        requestId,
        timestamp,
      };
    }

    // Unknown errors: never leak internals outside development.
    return {
      success: false,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code: ErrorCode.SERVER_ERROR,
      message:
        this.exposeServerErrors && exception instanceof Error
          ? exception.message
          : SAFE_SERVER_MESSAGE,
      requestId,
      timestamp,
    };
  }
}
