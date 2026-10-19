import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, type SessionDocument } from './schemas/session.schema';

@Injectable()
export class SessionsRepository {
  constructor(@InjectModel(Session.name) private readonly sessionModel: Model<SessionDocument>) {}

  async create(data: Partial<Session>): Promise<SessionDocument> {
    const session = new this.sessionModel(data);
    return session.save();
  }

  async findById(id: string): Promise<SessionDocument | null> {
    return this.sessionModel.findById(id).exec();
  }

  async findByTokenHash(refreshTokenHash: string): Promise<SessionDocument | null> {
    return this.sessionModel.findOne({ refreshTokenHash }).exec();
  }

  async updateTokenHash(
    id: string,
    newHash: string,
    expiresAt: Date,
  ): Promise<SessionDocument | null> {
    return this.sessionModel
      .findByIdAndUpdate(id, { $set: { refreshTokenHash: newHash, expiresAt } }, { new: true })
      .exec();
  }

  async revoke(id: string): Promise<SessionDocument | null> {
    return this.sessionModel
      .findByIdAndUpdate(id, { $set: { isRevoked: true } }, { new: true })
      .exec();
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await this.sessionModel
      .updateMany({ userId, isRevoked: false }, { $set: { isRevoked: true } })
      .exec();
  }

  async findActiveByUserId(userId: string): Promise<SessionDocument[]> {
    return this.sessionModel.find({ userId, isRevoked: false }).sort({ createdAt: -1 }).exec();
  }
}
