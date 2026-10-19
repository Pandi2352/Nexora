import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Stream } from 'stream';
import type { ApiResponse } from '../dto/api-response.dto';

/**
 * Standard global interceptor to ensure every controller response adheres to the
 * unified Nexora OS API envelope: { success, statusCode, message, data, meta, requestId, timestamp }.
 */
@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T> | unknown> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T> | unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((resData) => {
        // Bypass envelope for raw binary streams, buffers, or direct responses
        if (
          response.headersSent ||
          resData instanceof Stream ||
          Buffer.isBuffer(resData)
        ) {
          return resData;
        }

        const timestamp = new Date().toISOString();
        const requestId = request.requestId;
        const statusCode = response.statusCode || 200;

        // If controller already created a standardized response envelope
        if (
          resData &&
          typeof resData === 'object' &&
          'success' in resData &&
          resData.success === true
        ) {
          return {
            ...resData,
            statusCode: resData.statusCode ?? statusCode,
            requestId: resData.requestId ?? requestId,
            timestamp: resData.timestamp ?? timestamp,
          };
        }

        // Auto-envelope plain data returns
        return {
          success: true,
          statusCode,
          data: resData ?? null,
          requestId,
          timestamp,
        };
      }),
    );
  }
}
