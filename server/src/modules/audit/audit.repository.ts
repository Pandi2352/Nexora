import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, type AuditLogDocument } from './schemas/audit-log.schema';

@Injectable()
export class AuditRepository {
  constructor(
    @InjectModel(AuditLog.name)
    private readonly auditModel: Model<AuditLogDocument>,
  ) {}

  async createLog(data: Partial<AuditLog>): Promise<AuditLogDocument> {
    const doc = new this.auditModel(data);
    return doc.save();
  }

  async listLogs(
    organizationId: string,
    filters: { action?: string; actorId?: string; skip: number; limit: number },
  ): Promise<AuditLogDocument[]> {
    const query: Record<string, any> = { organizationId };

    if (filters.action) {
      query.action = { $regex: filters.action, $options: 'i' };
    }
    if (filters.actorId) {
      query.actorId = filters.actorId;
    }

    return this.auditModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(filters.skip)
      .limit(filters.limit)
      .exec();
  }

  async countLogs(
    organizationId: string,
    filters: { action?: string; actorId?: string },
  ): Promise<number> {
    const query: Record<string, any> = { organizationId };

    if (filters.action) {
      query.action = { $regex: filters.action, $options: 'i' };
    }
    if (filters.actorId) {
      query.actorId = filters.actorId;
    }

    return this.auditModel.countDocuments(query).exec();
  }
}
