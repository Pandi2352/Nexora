import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppException, CurrentUser, ErrorCode, HashUtil, JwtAuthGuard, createApiResponse } from '@/common';
import type { JwtPayload } from '../auth/auth.interface';
import { SessionsService } from '../sessions/sessions.service';
import { UsersService } from './users.service';
import { ChangePasswordDto, UpdateProfileDto } from './dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@CurrentUser() caller: JwtPayload) {
    const user = await this.usersService.findById(caller.sub);
    if (!user) {
      throw new AppException(HttpStatus.NOT_FOUND, 'User not found', ErrorCode.NOT_FOUND);
    }

    return createApiResponse(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        timezone: user.timezone,
        locale: user.locale,
        isEmailVerified: user.isEmailVerified,
        status: user.status,
        createdAt: user.createdAt,
      },
      'User profile retrieved',
    );
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update user profile' })
  async updateProfile(
    @CurrentUser() caller: JwtPayload,
    @Body() dto: UpdateProfileDto,
  ) {
    const updated = await this.usersService.update(caller.sub, dto);
    if (!updated) {
      throw new AppException(HttpStatus.NOT_FOUND, 'User not found', ErrorCode.NOT_FOUND);
    }

    return createApiResponse(
      {
        id: updated._id,
        email: updated.email,
        name: updated.name,
        avatarUrl: updated.avatarUrl,
        timezone: updated.timezone,
        locale: updated.locale,
      },
      'Profile updated successfully',
    );
  }

  @Post('me/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change account password' })
  async changePassword(
    @CurrentUser() caller: JwtPayload,
    @Body() dto: ChangePasswordDto,
  ) {
    const user = await this.usersService.findById(caller.sub);
    if (!user) {
      throw new AppException(HttpStatus.NOT_FOUND, 'User not found', ErrorCode.NOT_FOUND);
    }

    const isValid = await HashUtil.verifyPassword(dto.currentPassword, user.passwordHash);
    if (!isValid) {
      throw new AppException(
        HttpStatus.BAD_REQUEST,
        'Incorrect current password',
        ErrorCode.BAD_REQUEST,
      );
    }

    const newHash = await HashUtil.hashPassword(dto.newPassword);
    await this.usersService.updatePassword(caller.sub, newHash);

    // Revoke other active sessions for safety
    if (caller.sessionId) {
      await this.sessionsService.revokeOthersForUser(caller.sub, caller.sessionId);
    }

    return createApiResponse({ success: true }, 'Password changed successfully');
  }

  @Get('me/sessions')
  @ApiOperation({ summary: 'List active device sessions' })
  async listSessions(@CurrentUser() caller: JwtPayload) {
    const sessions = await this.sessionsService.getActiveUserSessions(caller.sub);

    const mapped = sessions.map((s) => ({
      id: s._id,
      userAgent: s.userAgent || 'Unknown browser / device',
      ipAddress: s.ipAddress || '127.0.0.1',
      isCurrent: s._id === caller.sessionId,
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
    }));

    return createApiResponse(mapped, 'Active sessions retrieved');
  }

  @Delete('me/sessions/:sessionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke a specific session' })
  async revokeSession(
    @CurrentUser() caller: JwtPayload,
    @Param('sessionId') sessionId: string,
  ) {
    const session = await this.sessionsService.findById(sessionId);
    if (!session || session.userId !== caller.sub) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Session not found', ErrorCode.NOT_FOUND);
    }

    await this.sessionsService.revokeSession(sessionId);
    return createApiResponse({ success: true }, 'Session revoked successfully');
  }

  @Post('me/sessions/revoke-others')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke all other active sessions' })
  async revokeOthers(@CurrentUser() caller: JwtPayload) {
    if (caller.sessionId) {
      await this.sessionsService.revokeOthersForUser(caller.sub, caller.sessionId);
    }
    return createApiResponse({ success: true }, 'All other sessions revoked successfully');
  }
}
