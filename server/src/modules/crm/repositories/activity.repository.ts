import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SalesActivity, SalesActivityDocument } from '../schemas/sales-activity.schema';

export interface ActivityFilterOptions {
  type?: string;
  companyId?: string;
  leadId?: string;
  performedById?: string;
}

@Injectable()
export class SalesActivityRepository {
  constructor(
    @InjectModel(SalesActivity.name)
    private readonly activityModel: Model<SalesActivityDocument>,
  ) {}

  async create(data: Partial<SalesActivity>): Promise<SalesActivityDocument> {
    return this.activityModel.create(data);
  }

  async findById(orgId: string, id: string): Promise<SalesActivityDocument | null> {
    return this.activityModel.findOne({ _id: id, organizationId: orgId }).exec();
  }

  async list(orgId: string, options: ActivityFilterOptions = {}): Promise<SalesActivityDocument[]> {
    const filter: Record<string, unknown> = { organizationId: orgId };

    if (options.type) filter.type = options.type;
    if (options.companyId) filter.companyId = options.companyId;
    if (options.leadId) filter.leadId = options.leadId;
    if (options.performedById) filter.performedById = options.performedById;

    return this.activityModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async update(
    orgId: string,
    id: string,
    update: Partial<SalesActivity>,
  ): Promise<SalesActivityDocument | null> {
    return this.activityModel
      .findOneAndUpdate({ _id: id, organizationId: orgId }, { $set: update }, { new: true })
      .exec();
  }

  async delete(orgId: string, id: string): Promise<boolean> {
    const res = await this.activityModel.deleteOne({ _id: id, organizationId: orgId }).exec();
    return res.deletedCount > 0;
  }
}
