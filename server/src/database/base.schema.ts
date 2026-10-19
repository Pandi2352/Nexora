import { Prop, SchemaFactory } from '@nestjs/mongoose';
import type { SchemaOptions } from '@nestjs/mongoose';
import type { Type } from '@nestjs/common';
import type { Schema } from 'mongoose';
import { generateUuid } from '@/common';

/**
 * Standard Mongoose schema options applied across all Nexora OS schemas.
 * Enforces automatic timestamps, disables versionKey (__v), and provides
 * consistent JSON/Object transformations with virtual id mapping.
 */
export const defaultSchemaOptions: SchemaOptions = {
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: Record<string, unknown>) => {
      ret.id = ret._id;
      delete ret.__v;
      return ret;
    },
  },
  toObject: {
    virtuals: true,
    transform: (_doc, ret: Record<string, unknown>) => {
      ret.id = ret._id;
      delete ret.__v;
      return ret;
    },
  },
};

/**
 * Common base fields for every collection in Nexora OS.
 * Guarantees UUID v4 string primary key, audit timestamps, and audit actors.
 */
export abstract class BaseDocument {
  @Prop({ type: String, default: () => generateUuid() })
  _id: string;

  @Prop({ type: String })
  createdBy?: string;

  @Prop({ type: String })
  updatedBy?: string;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Base document with first-class soft delete support.
 * Used for critical business entities that should never be hard-deleted.
 */
export abstract class SoftDeleteDocument extends BaseDocument {
  @Prop({ type: Boolean, default: false, index: true })
  isDeleted: boolean;

  @Prop({ type: Date })
  deletedAt?: Date;

  @Prop({ type: String })
  deletedBy?: string;
}

/**
 * Base for multi-tenant collections. Every tenant-owned document MUST extend this.
 * Guarantees required, indexed organizationId scoping.
 */
export abstract class TenantDocument extends BaseDocument {
  @Prop({ type: String, required: true, index: true })
  organizationId: string;
}

/**
 * Base for multi-tenant collections requiring soft delete capability.
 */
export abstract class TenantSoftDeleteDocument extends TenantDocument {
  @Prop({ type: Boolean, default: false, index: true })
  isDeleted: boolean;

  @Prop({ type: Date })
  deletedAt?: Date;

  @Prop({ type: String })
  deletedBy?: string;
}

/**
 * Applies standard base schema plugins (virtual id getter and JSON transformations) to a Mongoose schema.
 */
export function applyBaseSchemaPlugins<T extends Schema>(schema: T): T {
  schema.virtual('id').get(function (this: { _id: string }) {
    return this._id;
  });
  return schema;
}

/**
 * Creates a schema for class with default schema options and base plugins applied.
 */
export function createBaseSchema<TClass>(targetClass: Type<TClass>): Schema<TClass> {
  const schema = SchemaFactory.createForClass(targetClass);
  return applyBaseSchemaPlugins(schema);
}
