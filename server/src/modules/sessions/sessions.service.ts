import { Injectable } from '@nestjs/common';
import { Session, type SessionDocument } from './schemas/session.schema';
import { SessionsRepository } from './sessions.repository';

@Injectable()
export class SessionsService {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  async createSession(
    userId: string,
    refreshTokenHash: string,
    expiresAt: Date,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<SessionDocument> {
    return this.sessionsRepository.create({
      userId,
      refreshTokenHash,
      expiresAt,
      userAgent,
      ipAddress,
      isRevoked: false,
    });
  }

  async findByTokenHash(hash: string): Promise<SessionDocument | null> {
    return this.sessionsRepository.findByTokenHash(hash);
  }

  async findById(id: string): Promise<SessionDocument | null> {
    return this.sessionsRepository.findById(id);
  }

  async rotateSessionToken(
    id: string,
    newHash: string,
    expiresAt: Date,
  ): Promise<SessionDocument | null> {
    return this.sessionsRepository.updateTokenHash(id, newHash, expiresAt);
  }

  async revokeSession(id: string): Promise<SessionDocument | null> {
    return this.sessionsRepository.revoke(id);
  }

  async revokeAllUserSessions(userId: string): Promise<void> {
    return this.sessionsRepository.revokeAllForUser(userId);
  }

  async getActiveUserSessions(userId: string): Promise<SessionDocument[]> {
    return this.sessionsRepository.findActiveByUserId(userId);
  }
}
