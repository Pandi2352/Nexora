import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { BaseDocument, defaultSchemaOptions, applyBaseSchemaPlugins } from '@/database/base.schema';

export type BusinessUnitDocument = HydratedDocument<BusinessUnit>;

@Schema({ collection: 'business_units', ...defaultSchemaOptions })
export class BusinessUnit extends BaseDocument {
  @Prop({ type: String, required: true, index: true })
  organizationId: string;

  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({ type: String, required: true, trim: true, uppercase: true })
  code: string;

  @Prop({ type: String, trim: true })
  description?: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Boolean, default: false })
  isDefault: boolean;

  @Prop({ type: String, required: true })
  createdById: string;
}

export const BusinessUnitSchema = applyBaseSchemaPlugins(SchemaFactory.createForClass(BusinessUnit));

BusinessUnitSchema.index({ organizationId: 1, name: 1 }, { unique: true });
BusinessUnitSchema.index({ organizationId: 1, code: 1 }, { unique: true });
