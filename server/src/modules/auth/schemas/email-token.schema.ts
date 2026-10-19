import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { BaseDocument } from '@/database/base.schema';

export type EmailTokenDocument = HydratedDocument<EmailToken>;

export enum EmailTokenType {
  VerifyEmail = 'verify_email',
  ResetPassword = 'reset_password',
  ChangeEmail = 'change_email',
}

@Schema({ collection: 'email_tokens', timestamps: true, versionKey: false })
export class EmailToken extends BaseDocument {
  @Prop({ type: String, required: true, index: true })
  userId: string;

  @Prop({ type: String, enum: Object.values(EmailTokenType), required: true, index: true })
  type: EmailTokenType;

  @Prop({ type: String, required: true, unique: true })
  tokenHash: string;

  @Prop({ type: Object })
  metadata?: Record<string, unknown>;

  @Prop({ type: Date, required: true })
  expiresAt: Date;

  @Prop({ type: Boolean, default: false })
  isUsed: boolean;
}

export const EmailTokenSchema = SchemaFactory.createForClass(EmailToken);
EmailTokenSchema.index({ tokenHash: 1 }, { unique: true });
EmailTokenSchema.index({ userId: 1, type: 1 });
EmailTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
