import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { BaseDocument } from '@/database/base.schema';

export type OrganizationDocument = HydratedDocument<Organization>;

export enum OrganizationStatus {
  Active = 'active',
  Suspended = 'suspended',
  Deleted = 'deleted',
}

@Schema({ collection: 'organizations', timestamps: true, versionKey: false })
export class Organization extends BaseDocument {
  @Prop({ type: String, required: true, trim: true, maxlength: 100 })
  name: string;

  @Prop({ type: String, required: true, unique: true, lowercase: true, trim: true })
  slug: string;

  @Prop({ type: String, trim: true })
  logoUrl?: string;

  @Prop({ type: String, default: 'UTC', trim: true })
  timezone: string;

  @Prop({ type: String, default: 'en-US', trim: true })
  locale: string;

  @Prop({ type: String, required: true, index: true })
  ownerId: string;

  @Prop({
    type: String,
    enum: Object.values(OrganizationStatus),
    default: OrganizationStatus.Active,
    index: true,
  })
  status: OrganizationStatus;

  @Prop({ type: Date })
  deletedAt?: Date;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
OrganizationSchema.index({ slug: 1 }, { unique: true });
OrganizationSchema.index({ ownerId: 1 });
OrganizationSchema.index({ status: 1 });
OrganizationSchema.index({ createdAt: -1 });
