import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Opportunity, OpportunityDocument } from '../schemas/opportunity.schema';

export interface OpportunityFilterOptions {
  stage?: string;
  companyId?: string;
  ownerId?: string;
  isMustWin?: boolean;
}

@Injectable()
export class OpportunityRepository {
  constructor(
    @InjectModel(Opportunity.name)
    private readonly opportunityModel: Model<OpportunityDocument>,
  ) {}

  async create(data: Partial<Opportunity>): Promise<OpportunityDocument> {
    return this.opportunityModel.create(data);
  }

  async findById(orgId: string, id: string): Promise<OpportunityDocument | null> {
    return this.opportunityModel.findOne({ _id: id, organizationId: orgId }).exec();
  }

  async list(orgId: string, options: OpportunityFilterOptions = {}): Promise<OpportunityDocument[]> {
    const filter: Record<string, unknown> = { organizationId: orgId };

    if (options.stage) filter.stage = options.stage;
    if (options.companyId) filter.companyId = options.companyId;
    if (options.ownerId) filter.ownerId = options.ownerId;
    if (typeof options.isMustWin === 'boolean') filter.isMustWin = options.isMustWin;

    return this.opportunityModel.find(filter).sort({ createdAt: -1 }).exec();
  }

  async update(
    orgId: string,
    id: string,
    update: Partial<Opportunity>,
  ): Promise<OpportunityDocument | null> {
    return this.opportunityModel
      .findOneAndUpdate({ _id: id, organizationId: orgId }, { $set: update }, { new: true })
      .exec();
  }

  async delete(orgId: string, id: string): Promise<boolean> {
    const res = await this.opportunityModel.deleteOne({ _id: id, organizationId: orgId }).exec();
    return res.deletedCount > 0;
  }

  async getPipelineSummary(orgId: string): Promise<Array<{ stage: string; count: number; totalValue: number }>> {
    return this.opportunityModel.aggregate([
      { $match: { organizationId: orgId } },
      {
        $group: {
          _id: '$stage',
          count: { $sum: 1 },
          totalValue: { $sum: '$value' },
        },
      },
      {
        $project: {
          _id: 0,
          stage: '$_id',
          count: 1,
          totalValue: 1,
        },
      },
    ]);
  }
}
