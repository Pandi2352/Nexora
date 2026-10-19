import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Enterprise-grade HTTP request & response logger interceptor.
 * Logs method, route, status code, duration (ms), correlation requestId, client IP,
 * and authenticated user context across all API requests without exposing sensitive payload data.
 */
@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const startTime = Date.now();
    const { method, originalUrl, url, ip } = request;
    const path = originalUrl || url;
    const clientIp = (request.headers['x-forwarded-for'] as string) || ip || 'unknown';
    const requestId = request.requestId || 'no-req-id';

    const getContextTag = () => {
      const user = (request as unknown as { user?: { id?: string; sub?: string } }).user;
      const userId = user?.id ?? user?.sub;
      return userId ? ` [usr:${userId}]` : '';
    };

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;
          const logMsg = `[${method}] ${path} ${statusCode} +${duration}ms [req:${requestId}] [ip:${clientIp}]${getContextTag()}`;

          if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(logMsg);
          } else if (statusCode >= HttpStatus.BAD_REQUEST) {
            this.logger.warn(logMsg);
          } else {
            this.logger.log(logMsg);
          }
        },
        error: (err: unknown) => {
          const duration = Date.now() - startTime;
          const statusCode =
            err instanceof HttpException
              ? err.getStatus()
              : HttpStatus.INTERNAL_SERVER_ERROR;
          const errMsg = err instanceof Error ? err.message : String(err);
          const logMsg = `[${method}] ${path} ${statusCode} +${duration}ms [req:${requestId}] [ip:${clientIp}]${getContextTag()} - ${errMsg}`;

          if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
            this.logger.error(logMsg);
          } else {
            this.logger.warn(logMsg);
          }
        },
      }),
    );
  }
}
