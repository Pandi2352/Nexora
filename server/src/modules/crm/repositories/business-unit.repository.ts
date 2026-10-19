import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessUnit, BusinessUnitDocument } from '../schemas/business-unit.schema';

const DEFAULT_BUSINESS_UNITS = [
  { name: 'Enterprise', code: 'ENT', description: 'Enterprise and large global accounts', isDefault: true },
  { name: 'Mid Market', code: 'MID', description: 'Medium scale commercial companies', isDefault: false },
  { name: 'SMB', code: 'SMB', description: 'Small and medium business accounts', isDefault: false },
  { name: 'Government', code: 'GOV', description: 'Public sector and government entities', isDefault: false },
  { name: 'Digital', code: 'DIG', description: 'Direct digital and online inbound accounts', isDefault: false },
];

@Injectable()
export class BusinessUnitRepository {
  constructor(
    @InjectModel(BusinessUnit.name)
    private readonly buModel: Model<BusinessUnitDocument>,
  ) {}

  async findByOrg(organizationId: string, includeInactive = false): Promise<BusinessUnitDocument[]> {
    const filter: Record<string, any> = { organizationId };
    if (!includeInactive) {
      filter.isActive = true;
    }
    const units = await this.buModel.find(filter).sort({ name: 1 }).exec();

    // Auto-seed defaults if organization has none yet
    if (units.length === 0 && !includeInactive) {
      const seeded = await Promise.all(
        DEFAULT_BUSINESS_UNITS.map((u) =>
          this.buModel.create({
            organizationId,
            name: u.name,
            code: u.code,
            description: u.description,
            isDefault: u.isDefault,
            isActive: true,
            createdById: 'system',
          }),
        ),
      );
      return seeded;
    }

    return units;
  }

  async findById(organizationId: string, id: string): Promise<BusinessUnitDocument | null> {
    return this.buModel.findOne({ organizationId, _id: id }).exec();
  }

  async findByNameOrCode(
    organizationId: string,
    name: string,
    code: string,
  ): Promise<BusinessUnitDocument | null> {
    return this.buModel
      .findOne({
        organizationId,
        $or: [{ name: { $regex: new RegExp(`^${name}$`, 'i') } }, { code: code.toUpperCase() }],
      })
      .exec();
  }

  async create(data: Partial<BusinessUnit>): Promise<BusinessUnitDocument> {
    return this.buModel.create(data);
  }

  async update(
    organizationId: string,
    id: string,
    data: Partial<BusinessUnit>,
  ): Promise<BusinessUnitDocument | null> {
    return this.buModel
      .findOneAndUpdate({ organizationId, _id: id }, { $set: data }, { new: true })
      .exec();
  }

  async delete(organizationId: string, id: string): Promise<boolean> {
    const res = await this.buModel.deleteOne({ organizationId, _id: id }).exec();
    return (res.deletedCount ?? 0) > 0;
  }
}
