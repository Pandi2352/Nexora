import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailToken, type EmailTokenDocument, EmailTokenType } from './schemas/email-token.schema';

@Injectable()
export class EmailTokenRepository {
  constructor(
    @InjectModel(EmailToken.name)
    private readonly emailTokenModel: Model<EmailTokenDocument>,
  ) {}

  async create(data: Partial<EmailToken>): Promise<EmailTokenDocument> {
    const token = new this.emailTokenModel(data);
    return token.save();
  }

  async findValidToken(
    tokenHash: string,
    type: EmailTokenType,
  ): Promise<EmailTokenDocument | null> {
    return this.emailTokenModel
      .findOne({
        tokenHash,
        type,
        isUsed: false,
        expiresAt: { $gt: new Date() },
      })
      .exec();
  }

  async markAsUsed(id: string): Promise<EmailTokenDocument | null> {
    return this.emailTokenModel
      .findByIdAndUpdate(id, { $set: { isUsed: true } }, { new: true })
      .exec();
  }

  async invalidatePreviousTokens(userId: string, type: EmailTokenType): Promise<void> {
    await this.emailTokenModel
      .updateMany({ userId, type, isUsed: false }, { $set: { isUsed: true } })
      .exec();
  }
}
