import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { AppException, ErrorCode } from '@/common';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import type { EnvironmentVariables } from '@/config/env.validation';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService<EnvironmentVariables, true>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new AppException(
        HttpStatus.UNAUTHORIZED,
        'Authentication required',
        ErrorCode.UNAUTHORIZED,
      );
    }

    try {
      const secret = this.config.get('JWT_ACCESS_SECRET', { infer: true });
      const payload = await this.jwtService.verifyAsync(token, { secret });
      request.user = payload;
      return true;
    } catch {
      throw new AppException(
        HttpStatus.UNAUTHORIZED,
        'Invalid or expired authentication token',
        ErrorCode.UNAUTHORIZED,
      );
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
