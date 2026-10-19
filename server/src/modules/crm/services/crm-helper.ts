import { HttpStatus, Injectable } from '@nestjs/common';
import { AppException, ErrorCode } from '@/common';
import { OrganizationsRepository } from '../../organizations/organizations.repository';
import { MembershipStatus } from '../../organizations/schemas/membership.schema';
import type { JwtPayload } from '../../auth/auth.interface';

@Injectable()
export class CrmHelper {
  constructor(private readonly orgRepo: OrganizationsRepository) {}

  async resolveOrgAndMembership(callerUser: JwtPayload, orgIdOrSlug: string) {
    const org = await this.orgRepo.findOrgByIdOrSlug(orgIdOrSlug);
    if (!org) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Workspace not found', ErrorCode.NOT_FOUND);
    }
    const membership = await this.orgRepo.findMembership(org._id, callerUser.sub);
    if (!membership || membership.status !== MembershipStatus.Active) {
      throw new AppException(HttpStatus.FORBIDDEN, 'Access denied', ErrorCode.FORBIDDEN);
    }
    return { org, membership };
  }
}
