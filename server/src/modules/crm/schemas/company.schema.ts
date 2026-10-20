import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';
import { BaseDocument, defaultSchemaOptions, applyBaseSchemaPlugins } from '@/database/base.schema';

export type CompanyDocument = HydratedDocument<Company>;

export class CompanyAddress {
  @Prop({ type: String, trim: true })
  street?: string;

  @Prop({ type: String, trim: true })
  city?: string;

  @Prop({ type: String, trim: true })
  state?: string;

  @Prop({ type: String, trim: true })
  postalCode?: string;

  @Prop({ type: String, trim: true })
  country?: string;
}

@Schema({ collection: 'companies', ...defaultSchemaOptions })
export class Company extends BaseDocument {
  @Prop({ type: String, required: true, index: true })
  organizationId: string;

  @Prop({ type: String, required: true, trim: true, maxlength: 150 })
  name: string;

  @Prop({ type: String, trim: true, maxlength: 100 })
  industry?: string;

  @Prop({ type: String, trim: true, maxlength: 200 })
  website?: string;

  @Prop({ type: String, trim: true, maxlength: 50 })
  phone?: string;

  @Prop({ type: String, trim: true, maxlength: 150, lowercase: true })
  email?: string;

  @Prop({ type: CompanyAddress })
  address?: CompanyAddress;

  @Prop({ type: Number, default: 0 })
  annualRevenue?: number;

  @Prop({ type: String, trim: true })
  employeeCount?: string;

  @Prop({
    type: String,
    enum: ['prospect', 'customer', 'partner', 'inactive'],
    default: 'prospect',
  })
  status: string;

  @Prop({ type: String, index: true })
  ownerId?: string;
}

export const CompanySchema = applyBaseSchemaPlugins(SchemaFactory.createForClass(Company));
CompanySchema.index({ organizationId: 1, name: 1 });
CompanySchema.index({ organizationId: 1, createdAt: -1 });
