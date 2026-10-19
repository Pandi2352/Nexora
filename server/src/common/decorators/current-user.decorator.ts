import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

/** Extracts the authenticated user attached to the request by JwtAuthGuard. */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user;

    return data && user ? (user as Record<string, unknown>)[data] : user;
  },
);
