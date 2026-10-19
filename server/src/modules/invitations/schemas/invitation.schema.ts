import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { BaseDocument } from '@/database/base.schema';

export type InvitationDocument = HydratedDocument<Invitation>;

export enum InvitationStatus {
  Pending = 'pending',
  Accepted = 'accepted',
  Revoked = 'revoked',
  Expired = 'expired',
}

@Schema({ collection: 'invitations', timestamps: true, versionKey: false })
export class Invitation extends BaseDocument {
  @Prop({ type: String, required: true, index: true })
  organizationId: string;

  @Prop({ type: String, required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ type: String, required: true, trim: true })
  role: string;

  @Prop({ type: String, required: true, index: true })
  invitedById: string;

  @Prop({ type: String, required: true, index: true })
  tokenHash: string;

  @Prop({
    type: String,
    enum: Object.values(InvitationStatus),
    default: InvitationStatus.Pending,
    index: true,
  })
  status: InvitationStatus;

  @Prop({ type: Date, required: true, index: true })
  expiresAt: Date;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);
InvitationSchema.index({ organizationId: 1, email: 1 });
InvitationSchema.index({ tokenHash: 1 }, { unique: true });
InvitationSchema.index({ expiresAt: 1 });
InvitationSchema.index({ createdAt: -1 });
