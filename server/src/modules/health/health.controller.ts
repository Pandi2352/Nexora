import { Controller, Get, HttpStatus } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConnectionStates, type Connection } from 'mongoose';
import { AppException, createApiResponse, ErrorCode } from '@/common';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get('live')
  @ApiOperation({ summary: 'Liveness: the process is running' })
  @ApiResponse({ status: 200, description: 'Process is alive' })
  live() {
    return createApiResponse({ status: 'ok', uptime: Math.round(process.uptime()) });
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness: the instance can serve traffic (database reachable)' })
  @ApiResponse({ status: 200, description: 'Ready' })
  @ApiResponse({ status: 503, description: 'Database unavailable' })
  ready() {
    if (this.connection.readyState !== ConnectionStates.connected) {
      throw new AppException(
        HttpStatus.SERVICE_UNAVAILABLE,
        'Database is not reachable.',
        ErrorCode.SERVICE_UNAVAILABLE,
      );
    }
    return createApiResponse({ status: 'ok', database: 'up' });
  }
}
