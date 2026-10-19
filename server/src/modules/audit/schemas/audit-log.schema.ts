import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { BaseDocument } from '@/database/base.schema';

export type AuditLogDocument = HydratedDocument<AuditLog>;

export enum AuditStatus {
  Success = 'success',
  Failure = 'failure',
}

@Schema({ collection: 'audit_logs', timestamps: { createdAt: true, updatedAt: false }, versionKey: false })
export class AuditLog extends BaseDocument {
  @Prop({ type: String, index: true })
  organizationId?: string;

  @Prop({ type: String, required: true, index: true })
  actorId: string;

  @Prop({ type: String })
  actorName?: string;

  @Prop({ type: String })
  actorEmail?: string;

  @Prop({ type: String, required: true, index: true })
  action: string;

  @Prop({ type: String, required: true })
  targetType: string;

  @Prop({ type: String })
  targetId?: string;

  @Prop({ type: Object })
  metadata?: Record<string, unknown>;

  @Prop({ type: String })
  ipAddress?: string;

  @Prop({ type: String })
  userAgent?: string;

  @Prop({ type: String })
  requestId?: string;

  @Prop({ type: String, enum: Object.values(AuditStatus), default: AuditStatus.Success, index: true })
  status: AuditStatus;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
AuditLogSchema.index({ organizationId: 1, createdAt: -1 });
AuditLogSchema.index({ actorId: 1, createdAt: -1 });
AuditLogSchema.index({ organizationId: 1, action: 1 });
AuditLogSchema.index({ createdAt: -1 });
