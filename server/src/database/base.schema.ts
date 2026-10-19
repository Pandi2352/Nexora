import { Prop } from '@nestjs/mongoose';
import { generateUuid } from '@/common';

/**
 * Fields shared by every collection. Concrete schemas extend this and add
 * `@Schema({ timestamps: true, versionKey: false })`.
 * `_id` is a UUID v4 string; MongoDB ObjectId is never used.
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
 * Base for tenant-owned collections. Every query on these must filter by
 * `organizationId`, taken from the resolved tenant context, never the request body.
 */
export abstract class TenantDocument extends BaseDocument {
  @Prop({ type: String, required: true, index: true })
  organizationId: string;
}
