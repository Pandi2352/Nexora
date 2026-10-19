import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AppException, ErrorCode } from '@/common';
import type { JwtPayload } from '../../auth/auth.interface';
import { SalesActivityRepository, type ActivityFilterOptions } from '../repositories/activity.repository';
import { CreateSalesActivityDto } from '../dto/create-activity.dto';
import { CrmHelper } from './crm-helper';

@Injectable()
export class SalesActivityService {
  private readonly logger = new Logger(SalesActivityService.name);

  constructor(
    private readonly activityRepo: SalesActivityRepository,
    private readonly crmHelper: CrmHelper,
  ) {}

  async listActivities(callerUser: JwtPayload, orgIdOrSlug: string, options: ActivityFilterOptions = {}) {
    const { org } = await this.crmHelper.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    this.logger.debug(`Listing activities for org=${org.slug} type=${options.type ?? 'all'}`);
    return this.activityRepo.list(org._id, options);
  }

  async logActivity(callerUser: JwtPayload, orgIdOrSlug: string, dto: CreateSalesActivityDto) {
    const { org } = await this.crmHelper.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    this.logger.log(`Logging activity type="${dto.type}" title="${dto.title}" in org=${org.slug} by user=${callerUser.sub}`);
    return this.activityRepo.create({
      ...dto,
      organizationId: org._id,
      performedById: callerUser.sub,
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
      completedAt: dto.completedAt ? new Date(dto.completedAt) : new Date(),
    });
  }

  async updateActivity(
    callerUser: JwtPayload,
    orgIdOrSlug: string,
    activityId: string,
    dto: Partial<CreateSalesActivityDto>,
  ) {
    const { org } = await this.crmHelper.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    const updated = await this.activityRepo.update(org._id, activityId, {
      ...dto,
      scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
      completedAt: dto.completedAt ? new Date(dto.completedAt) : undefined,
    });
    if (!updated) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Activity not found', ErrorCode.NOT_FOUND);
    }
    return updated;
  }

  async deleteActivity(callerUser: JwtPayload, orgIdOrSlug: string, activityId: string) {
    const { org } = await this.crmHelper.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    const deleted = await this.activityRepo.delete(org._id, activityId);
    if (!deleted) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Activity not found', ErrorCode.NOT_FOUND);
    }
    return { success: true };
  }
}
