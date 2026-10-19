import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AppException, ErrorCode } from '@/common';
import type { JwtPayload } from '../../auth/auth.interface';
import { OpportunityRepository, type OpportunityFilterOptions } from '../repositories/opportunity.repository';
import { CreateOpportunityDto, UpdateOpportunityDto, UpdateOpportunityStageDto } from '../dto/create-opportunity.dto';
import { CrmHelper } from './crm-helper';

@Injectable()
export class OpportunityService {
  private readonly logger = new Logger(OpportunityService.name);

  constructor(
    private readonly oppRepo: OpportunityRepository,
    private readonly crmHelper: CrmHelper,
  ) {}

  async listOpportunities(callerUser: JwtPayload, orgIdOrSlug: string, options: OpportunityFilterOptions = {}) {
    const { org } = await this.crmHelper.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    this.logger.debug(`Listing opportunities for org=${org.slug} stage=${options.stage ?? 'all'}`);
    return this.oppRepo.list(org._id, options);
  }

  async createOpportunity(callerUser: JwtPayload, orgIdOrSlug: string, dto: CreateOpportunityDto) {
    const { org } = await this.crmHelper.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    this.logger.log(`Creating deal "${dto.title}" value=₹${dto.value} stage=${dto.stage ?? 'qualification'} org=${org.slug}`);
    return this.oppRepo.create({
      ...dto,
      organizationId: org._id,
      ownerId: dto.ownerId ?? callerUser.sub,
      expectedCloseDate: dto.expectedCloseDate ? new Date(dto.expectedCloseDate) : undefined,
    });
  }

  async getOpportunity(callerUser: JwtPayload, orgIdOrSlug: string, oppId: string) {
    const { org } = await this.crmHelper.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    const opp = await this.oppRepo.findById(org._id, oppId);
    if (!opp) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Opportunity not found', ErrorCode.NOT_FOUND);
    }
    return opp;
  }

  async updateOpportunity(
    callerUser: JwtPayload,
    orgIdOrSlug: string,
    oppId: string,
    dto: UpdateOpportunityDto,
  ) {
    const { org } = await this.crmHelper.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    this.logger.log(`Updating opportunity id=${oppId} in org=${org.slug}`);
    const updated = await this.oppRepo.update(org._id, oppId, {
      ...dto,
      expectedCloseDate: dto.expectedCloseDate ? new Date(dto.expectedCloseDate) : undefined,
    });
    if (!updated) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Opportunity not found', ErrorCode.NOT_FOUND);
    }
    return updated;
  }

  async updateStage(
    callerUser: JwtPayload,
    orgIdOrSlug: string,
    oppId: string,
    dto: UpdateOpportunityStageDto,
  ) {
    const { org } = await this.crmHelper.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    const updated = await this.oppRepo.update(org._id, oppId, { stage: dto.stage });
    if (!updated) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Opportunity not found', ErrorCode.NOT_FOUND);
    }
    this.logger.log(`Deal ${oppId} advanced to stage "${dto.stage}" in org=${org.slug}`);
    return updated;
  }

  async getPipelineSummary(callerUser: JwtPayload, orgIdOrSlug: string) {
    const { org } = await this.crmHelper.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    return this.oppRepo.getPipelineSummary(org._id);
  }

  async deleteOpportunity(callerUser: JwtPayload, orgIdOrSlug: string, oppId: string) {
    const { org } = await this.crmHelper.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    this.logger.log(`Deleting opportunity id=${oppId} in org=${org.slug}`);
    const deleted = await this.oppRepo.delete(org._id, oppId);
    if (!deleted) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Opportunity not found', ErrorCode.NOT_FOUND);
    }
    return { success: true };
  }
}
