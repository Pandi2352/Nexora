import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lead, LeadDocument } from '../schemas/lead.schema';

export interface LeadFilterOptions {
  search?: string;
  status?: string;
  leadOwnerId?: string;
  isMustWin?: boolean;
  businessUnit?: string;
}

@Injectable()
export class LeadRepository {
  constructor(
    @InjectModel(Lead.name) private readonly leadModel: Model<LeadDocument>,
  ) {}

  async create(data: Partial<Lead>): Promise<LeadDocument> {
    return this.leadModel.create(data);
  }

  async findById(orgId: string, id: string): Promise<LeadDocument | null> {
    return this.leadModel.findOne({ _id: id, organizationId: orgId }).exec();
  }

  async list(orgId: string, options: LeadFilterOptions = {}): Promise<LeadDocument[]> {
    const filter: Record<string, unknown> = { organizationId: orgId };

    if (options.status) {
      filter.status = options.status;
    }
    if (options.leadOwnerId) {
      filter.leadOwnerId = options.leadOwnerId;
    }
    if (typeof options.isMustWin === 'boolean') {
      filter.isMustWin = options.isMustWin;
    }
    if (options.businessUnit) {
      filter.businessUnit = options.businessUnit;
    }
    if (options.search && options.search.trim()) {
      filter.$or = [
        { companyName: { $regex: options.search.trim(), $options: 'i' } },
        { contactFirstName: { $regex: options.search.trim(), $options: 'i' } },
        { contactLastName: { $regex: options.search.trim(), $options: 'i' } },
        { contactEmail: { $regex: options.search.trim(), $options: 'i' } },
      ];
    }

    return this.leadModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async update(orgId: string, id: string, update: Partial<Lead>): Promise<LeadDocument | null> {
    return this.leadModel
      .findOneAndUpdate({ _id: id, organizationId: orgId }, { $set: update }, { new: true })
      .exec();
  }

  async delete(orgId: string, id: string): Promise<boolean> {
    const res = await this.leadModel.deleteOne({ _id: id, organizationId: orgId }).exec();
    return res.deletedCount > 0;
  }

  async count(orgId: string): Promise<number> {
    return this.leadModel.countDocuments({ organizationId: orgId }).exec();
  }
}
