import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { BaseDocument } from '@/database/base.schema';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ collection: 'roles', timestamps: true, versionKey: false })
export class Role extends BaseDocument {
  @Prop({ type: String, index: true })
  organizationId?: string;

  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({ type: String, required: true, trim: true, index: true })
  slug: string;

  @Prop({ type: String, required: true, trim: true })
  description: string;

  @Prop({ type: [String], default: [] })
  permissions: string[];

  @Prop({ type: Boolean, default: true, index: true })
  isSystem: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
RoleSchema.index({ organizationId: 1, slug: 1 }, { unique: true, sparse: true });
RoleSchema.index({ isSystem: 1 });
