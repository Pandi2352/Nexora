import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { BaseDocument } from '@/database/base.schema';

export type MembershipDocument = HydratedDocument<Membership>;

export enum MembershipRole {
  Owner = 'owner',
  Admin = 'admin',
  Manager = 'manager',
  Member = 'member',
  SupportAgent = 'support_agent',
}

export enum MembershipStatus {
  Active = 'active',
  Suspended = 'suspended',
}

@Schema({ collection: 'memberships', timestamps: true, versionKey: false })
export class Membership extends BaseDocument {
  @Prop({ type: String, required: true, index: true })
  organizationId: string;

  @Prop({ type: String, required: true, index: true })
  userId: string;

  @Prop({
    type: String,
    enum: Object.values(MembershipRole),
    default: MembershipRole.Member,
    index: true,
  })
  role: MembershipRole;

  @Prop({
    type: String,
    enum: Object.values(MembershipStatus),
    default: MembershipStatus.Active,
    index: true,
  })
  status: MembershipStatus;

  @Prop({ type: Date, default: () => new Date() })
  joinedAt: Date;
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);
MembershipSchema.index({ organizationId: 1, userId: 1 }, { unique: true });
MembershipSchema.index({ userId: 1, status: 1 });
MembershipSchema.index({ organizationId: 1, status: 1 });
MembershipSchema.index({ createdAt: -1 });
