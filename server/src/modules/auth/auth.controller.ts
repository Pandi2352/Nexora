import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import { CurrentUser, Public, createApiResponse, JwtAuthGuard } from '@/common';
import type { EnvironmentVariables } from '@/config/env.validation';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResendVerificationDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from './dto';
import type { JwtPayload } from './auth.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly isCookieSecure: boolean;

  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService<EnvironmentVariables, true>,
  ) {
    this.isCookieSecure = this.config.get('COOKIE_SECURE', { infer: true });
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    return createApiResponse(user, 'Account registered. Please verify your email.');
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email with token' })
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    const result = await this.authService.verifyEmail(dto.token);
    return createApiResponse(result, result.message);
  }

  @Public()
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend email verification link' })
  async resendVerification(@Body() dto: ResendVerificationDto) {
    const result = await this.authService.resendVerification(dto.email);
    return createApiResponse(result, result.message);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in with email and password' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;

    const { user, accessToken, refreshToken } = await this.authService.login(
      dto,
      userAgent,
      ipAddress,
    );

    this.setRefreshTokenCookie(res, refreshToken);

    return createApiResponse({ user, accessToken }, 'Logged in successfully');
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotate and acquire new access token via HttpOnly cookie' })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const rawRefreshToken = req.cookies?.refreshToken;
    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refresh(rawRefreshToken);

    this.setRefreshTokenCookie(res, newRefreshToken);

    return createApiResponse({ accessToken }, 'Token refreshed');
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke active session and clear cookie' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const rawRefreshToken = req.cookies?.refreshToken;
    await this.authService.logout(rawRefreshToken);
    this.clearRefreshTokenCookie(res);

    return createApiResponse(null, 'Logged out successfully');
  }

  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke all sessions across all devices' })
  async logoutAll(@CurrentUser() user: JwtPayload, @Res({ passthrough: true }) res: Response) {
    await this.authService.logoutAll(user.sub);
    this.clearRefreshTokenCookie(res);

    return createApiResponse(null, 'Logged out from all devices');
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset email' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    const result = await this.authService.forgotPassword(dto);
    return createApiResponse(result, result.message);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Set new password with reset token' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    const result = await this.authService.resetPassword(dto);
    return createApiResponse(result, result.message);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  async getMe(@CurrentUser() user: JwtPayload) {
    return createApiResponse(user);
  }

  private setRefreshTokenCookie(res: Response, token: string): void {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: this.isCookieSecure,
      sameSite: 'strict',
      path: '/api/v1/auth',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
  }

  private clearRefreshTokenCookie(res: Response): void {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: this.isCookieSecure,
      sameSite: 'strict',
      path: '/api/v1/auth',
    });
  }
}
