import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AppException, ErrorCode } from '@/common';
import type { JwtPayload } from '../../auth/auth.interface';
import { BusinessUnitRepository } from '../repositories/business-unit.repository';
import { CreateBusinessUnitDto, UpdateBusinessUnitDto } from '../dto/create-business-unit.dto';
import { CrmHelper } from './crm-helper';

@Injectable()
export class BusinessUnitService {
  private readonly logger = new Logger(BusinessUnitService.name);

  constructor(
    private readonly buRepo: BusinessUnitRepository,
    private readonly crmHelper: CrmHelper,
  ) {}

  async listBusinessUnits(callerUser: JwtPayload, orgIdOrSlug: string, includeInactive = false) {
    const { org } = await this.crmHelper.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    this.logger.debug(`Listing business units for org=${org.slug} includeInactive=${includeInactive}`);
    const units = await this.buRepo.findByOrg(org._id, includeInactive);
    return units.map((u) => u.toJSON ? u.toJSON() : u);
  }

  async createBusinessUnit(callerUser: JwtPayload, orgIdOrSlug: string, dto: CreateBusinessUnitDto) {
    const { org } = await this.crmHelper.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    this.logger.log(`Creating business unit "${dto.name}" (${dto.code}) in org=${org.slug}`);

    const existing = await this.buRepo.findByNameOrCode(org._id, dto.name.trim(), dto.code.trim());
    if (existing) {
      throw new AppException(
        HttpStatus.CONFLICT,
        'A business unit with this name or code already exists in your organization',
        ErrorCode.CONFLICT,
      );
    }

    const created = await this.buRepo.create({
      organizationId: org._id,
      name: dto.name.trim(),
      code: dto.code.trim().toUpperCase(),
      description: dto.description?.trim(),
      isActive: dto.isActive !== undefined ? dto.isActive : true,
      isDefault: !!dto.isDefault,
      createdById: callerUser.sub,
    });
    return created.toJSON ? created.toJSON() : created;
  }

  async updateBusinessUnit(
    callerUser: JwtPayload,
    orgIdOrSlug: string,
    id: string,
    dto: UpdateBusinessUnitDto,
  ) {
    const { org } = await this.crmHelper.resolveOrgAndMembership(callerUser, orgIdOrSlug);

    const existing = await this.buRepo.findById(org._id, id);
    if (!existing) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Business unit not found', ErrorCode.NOT_FOUND);
    }

    if (dto.name || dto.code) {
      const conflict = await this.buRepo.findByNameOrCode(
        org._id,
        dto.name ? dto.name.trim() : existing.name,
        dto.code ? dto.code.trim() : existing.code,
      );
      if (conflict && (conflict._id !== id && conflict.id !== id)) {
        throw new AppException(
          HttpStatus.CONFLICT,
          'Another business unit with this name or code already exists',
          ErrorCode.CONFLICT,
        );
      }
    }

    this.logger.log(`Updating business unit id=${id} in org=${org.slug}`);
    const updated = await this.buRepo.update(org._id, id, {
      ...(dto.name ? { name: dto.name.trim() } : {}),
      ...(dto.code ? { code: dto.code.trim().toUpperCase() } : {}),
      ...(dto.description !== undefined ? { description: dto.description.trim() } : {}),
      ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
      ...(dto.isDefault !== undefined ? { isDefault: dto.isDefault } : {}),
    });

    return updated && updated.toJSON ? updated.toJSON() : updated;
  }

  async deleteBusinessUnit(callerUser: JwtPayload, orgIdOrSlug: string, id: string) {
    const { org } = await this.crmHelper.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    this.logger.log(`Deleting business unit id=${id} in org=${org.slug}`);
    const deleted = await this.buRepo.delete(org._id, id);
    if (!deleted) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Business unit not found', ErrorCode.NOT_FOUND);
    }
    return { success: true };
  }
}
