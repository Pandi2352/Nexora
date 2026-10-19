import { HttpStatus, Injectable } from '@nestjs/common';
import { AppException, ErrorCode, HashUtil } from '@/common';
import { EmailService } from '@/integrations/email';
import { UsersService } from '../users/users.service';
import type { UserDocument } from '../users/schemas/user.schema';
import { UserStatus } from '../users/schemas/user.schema';
import { SessionsService } from '../sessions/sessions.service';
import { EmailTokenType } from './schemas/email-token.schema';
import { AuthTokenService } from './auth-token.service';
import type { ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto } from './dto';
import type { AuthenticatedUser } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
    private readonly tokenService: AuthTokenService,
    private readonly emailService: EmailService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthenticatedUser> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new AppException(
        HttpStatus.CONFLICT,
        'An account with this email already exists',
        ErrorCode.CONFLICT,
      );
    }

    const passwordHash = await HashUtil.hashPassword(dto.password);
    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      isEmailVerified: false,
      status: UserStatus.Active,
    });

    const rawToken = await this.tokenService.createVerificationToken(user._id);
    void this.emailService.sendVerificationEmail(user.email, user.name, rawToken);

    return this.mapSafeUser(user);
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const record = await this.tokenService.validateAndConsumeToken(
      token,
      EmailTokenType.VerifyEmail,
    );

    await this.usersService.markEmailVerified(record.userId);
    return { message: 'Email successfully verified' };
  }

  async resendVerification(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);
    if (user && !user.isEmailVerified) {
      await this.tokenService.invalidatePreviousTokens(user._id, EmailTokenType.VerifyEmail);
      const rawToken = await this.tokenService.createVerificationToken(user._id);
      void this.emailService.sendVerificationEmail(user.email, user.name, rawToken);
    }

    return { message: 'If an unverified account exists, a link was sent.' };
  }

  async login(
    dto: LoginDto,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<{ user: AuthenticatedUser; accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new AppException(
        HttpStatus.UNAUTHORIZED,
        'Invalid email or password',
        ErrorCode.UNAUTHORIZED,
      );
    }

    const isValid = await HashUtil.verifyPassword(dto.password, user.passwordHash);
    if (!isValid) {
      throw new AppException(
        HttpStatus.UNAUTHORIZED,
        'Invalid email or password',
        ErrorCode.UNAUTHORIZED,
      );
    }

    if (user.status === UserStatus.Suspended) {
      throw new AppException(
        HttpStatus.FORBIDDEN,
        'Account suspended. Please contact support.',
        ErrorCode.FORBIDDEN,
      );
    }

    const tokens = await this.tokenService.createSessionAndTokens(user, userAgent, ipAddress);

    return {
      user: this.mapSafeUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async refresh(rawRefreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const session = await this.tokenService.findSessionByToken(rawRefreshToken);
    const userId = session?.userId;
    const user = userId ? await this.usersService.findById(userId) : null;

    if (!user) {
      throw new AppException(HttpStatus.UNAUTHORIZED, 'User not found', ErrorCode.UNAUTHORIZED);
    }

    return this.tokenService.rotateRefreshToken(rawRefreshToken, user);
  }

  async logout(rawRefreshToken?: string): Promise<void> {
    if (rawRefreshToken) {
      const session = await this.tokenService.findSessionByToken(rawRefreshToken);
      if (session) {
        await this.sessionsService.revokeSession(session._id);
      }
    }
  }

  async logoutAll(userId: string): Promise<void> {
    await this.sessionsService.revokeAllUserSessions(userId);
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(dto.email);
    if (user && user.status === UserStatus.Active) {
      await this.tokenService.invalidatePreviousTokens(user._id, EmailTokenType.ResetPassword);
      const rawToken = await this.tokenService.createPasswordResetToken(user._id);
      void this.emailService.sendPasswordResetEmail(user.email, user.name, rawToken);
    }

    return { message: 'If an account exists, a password reset link was dispatched.' };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const record = await this.tokenService.validateAndConsumeToken(
      dto.token,
      EmailTokenType.ResetPassword,
    );

    const passwordHash = await HashUtil.hashPassword(dto.newPassword);
    await this.usersService.updatePassword(record.userId, passwordHash);

    // Invalidate all existing sessions after password reset
    await this.sessionsService.revokeAllUserSessions(record.userId);

    return { message: 'Password reset successfully. Please log in with your new password.' };
  }

  mapSafeUser(user: UserDocument): AuthenticatedUser {
    return {
      id: user._id,
      email: user.email,
      name: user.name,
      isPlatformAdmin: user.isPlatformAdmin,
      avatarUrl: user.avatarUrl,
      timezone: user.timezone,
      locale: user.locale,
    };
  }
}
