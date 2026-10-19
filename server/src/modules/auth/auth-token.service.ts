import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AppException, DateUtil, ErrorCode, HashUtil } from '@/common';
import type { EnvironmentVariables } from '@/config/env.validation';
import type { UserDocument } from '../users/schemas/user.schema';
import { UserStatus } from '../users/schemas/user.schema';
import { SessionsService } from '../sessions/sessions.service';
import type { SessionDocument } from '../sessions/schemas/session.schema';
import { EmailTokenType } from './schemas/email-token.schema';
import { EmailTokenRepository } from './email-token.repository';
import type { JwtPayload } from './auth.interface';

@Injectable()
export class AuthTokenService {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly emailTokenRepo: EmailTokenRepository,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService<EnvironmentVariables, true>,
  ) {}

  async createSessionAndTokens(
    user: UserDocument,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const rawRefreshToken = HashUtil.randomToken(48);
    const session = await this.sessionsService.createSession(
      user._id,
      HashUtil.sha256(rawRefreshToken),
      DateUtil.addDays(new Date(), 30),
      userAgent,
      ipAddress,
    );

    const accessToken = await this.signAccessToken(user, session._id);
    return { accessToken, refreshToken: rawRefreshToken };
  }

  async rotateRefreshToken(
    rawRefreshToken: string,
    user: UserDocument,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (!rawRefreshToken) {
      throw new AppException(
        HttpStatus.UNAUTHORIZED,
        'Refresh token required',
        ErrorCode.UNAUTHORIZED,
      );
    }

    const tokenHash = HashUtil.sha256(rawRefreshToken);
    const session = await this.sessionsService.findByTokenHash(tokenHash);

    if (!session || session.isRevoked) {
      if (session) {
        await this.sessionsService.revokeAllUserSessions(session.userId);
      }
      throw new AppException(
        HttpStatus.UNAUTHORIZED,
        'Invalid session or token reuse detected',
        ErrorCode.UNAUTHORIZED,
      );
    }

    if (DateUtil.isExpired(session.expiresAt)) {
      throw new AppException(
        HttpStatus.UNAUTHORIZED,
        'Session expired. Please log in again.',
        ErrorCode.UNAUTHORIZED,
      );
    }

    if (user.status !== UserStatus.Active) {
      throw new AppException(
        HttpStatus.UNAUTHORIZED,
        'User not found or inactive',
        ErrorCode.UNAUTHORIZED,
      );
    }

    const newRawRefreshToken = HashUtil.randomToken(48);
    await this.sessionsService.rotateSessionToken(
      session._id,
      HashUtil.sha256(newRawRefreshToken),
      DateUtil.addDays(new Date(), 30),
    );

    const accessToken = await this.signAccessToken(user, session._id);
    return { accessToken, refreshToken: newRawRefreshToken };
  }

  async findSessionByToken(rawRefreshToken: string): Promise<SessionDocument | null> {
    return this.sessionsService.findByTokenHash(HashUtil.sha256(rawRefreshToken));
  }

  async createVerificationToken(userId: string, email?: string): Promise<string> {
    await this.invalidatePreviousTokens(userId, EmailTokenType.VerifyEmail);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.emailTokenRepo.create({
      userId,
      type: EmailTokenType.VerifyEmail,
      tokenHash: HashUtil.sha256(code),
      expiresAt: DateUtil.addMinutes(new Date(), 15),
      metadata: { email, attempts: 0 },
    });
    return code;
  }

  async validateVerificationOtp(userId: string, code: string) {
    const token = await this.emailTokenRepo.findLatestActiveToken(
      userId,
      EmailTokenType.VerifyEmail,
    );
    if (!token) {
      throw new AppException(
        HttpStatus.BAD_REQUEST,
        'Verification code has expired or is invalid. Please request a new code.',
        ErrorCode.BAD_REQUEST,
      );
    }

    const attempts = (token.metadata as { attempts?: number } | undefined)?.attempts ?? 0;
    if (attempts >= 5) {
      await this.emailTokenRepo.markAsUsed(token._id);
      throw new AppException(
        HttpStatus.BAD_REQUEST,
        'Too many failed attempts. This code has been invalidated. Please request a new code.',
        ErrorCode.BAD_REQUEST,
      );
    }

    if (token.tokenHash !== HashUtil.sha256(code.trim())) {
      await this.emailTokenRepo.incrementAttempts(token._id);
      const remaining = 5 - (attempts + 1);
      throw new AppException(
        HttpStatus.BAD_REQUEST,
        `Incorrect verification code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
        ErrorCode.BAD_REQUEST,
      );
    }

    await this.emailTokenRepo.markAsUsed(token._id);
    return token;
  }

  async createPasswordResetToken(userId: string): Promise<string> {
    const rawToken = HashUtil.randomToken(32);
    await this.emailTokenRepo.create({
      userId,
      type: EmailTokenType.ResetPassword,
      tokenHash: HashUtil.sha256(rawToken),
      expiresAt: DateUtil.addMinutes(new Date(), 60),
    });
    return rawToken;
  }

  async validateAndConsumeToken(rawToken: string, type: EmailTokenType) {
    const tokenHash = HashUtil.sha256(rawToken);
    const record = await this.emailTokenRepo.findValidToken(tokenHash, type);

    if (!record) {
      throw new AppException(
        HttpStatus.BAD_REQUEST,
        `Invalid or expired ${type} token`,
        ErrorCode.BAD_REQUEST,
      );
    }

    await this.emailTokenRepo.markAsUsed(record._id);
    return record;
  }

  async invalidatePreviousTokens(userId: string, type: EmailTokenType): Promise<void> {
    return this.emailTokenRepo.invalidatePreviousTokens(userId, type);
  }

  async signAccessToken(user: UserDocument, sessionId: string): Promise<string> {
    const payload: JwtPayload = {
      sub: user._id,
      email: user.email,
      isPlatformAdmin: user.isPlatformAdmin,
      sessionId,
    };

    return this.jwtService.signAsync(payload, {
      secret: this.config.get('JWT_ACCESS_SECRET', { infer: true }),
      expiresIn: this.config.get('JWT_ACCESS_TTL', { infer: true }) as any,
    });
  }
}
