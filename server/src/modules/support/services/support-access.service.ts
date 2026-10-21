import { HttpStatus, Injectable } from '@nestjs/common';
import { AppException, ErrorCode } from '@/common';
import type { JwtPayload } from '../../auth/auth.interface';
import { OrganizationsRepository } from '../../organizations/organizations.repository';
import { MembershipStatus } from '../../organizations/schemas/membership.schema';
import { SYSTEM_ROLE_PERMISSIONS } from '../../roles/permissions.constants';
import { UsersRepository } from '../../users/users.repository';
import { SupportPermission } from '../constants/support.constants';

/** Who is acting, in which workspace, with which permissions. Passed to every support service call. */
export interface SupportContext {
  orgId: string;
  orgSlug: string;
  actorId: string;
  actorName: string;
  actorEmail: string;
  permissions: string[];
  can: (permission: string) => boolean;
}

/**
 * Resolves the workspace + active membership and enforces support permissions on the
 * server (IAM-007, IAM-009). Records in other workspaces are never reachable.
 */
@Injectable()
export class SupportAccessService {
  constructor(
    private readonly orgRepo: OrganizationsRepository,
    private readonly usersRepo: UsersRepository,
  ) {}

  async resolve(user: JwtPayload, orgIdOrSlug: string, required: string): Promise<SupportContext> {
    const org = await this.orgRepo.findOrgByIdOrSlug(orgIdOrSlug);
    if (!org)
      throw new AppException(HttpStatus.NOT_FOUND, 'Workspace not found', ErrorCode.NOT_FOUND);

    const membership = await this.orgRepo.findMembership(org._id, user.sub);
    if (!membership || membership.status !== MembershipStatus.Active) {
      throw new AppException(HttpStatus.FORBIDDEN, 'Access denied', ErrorCode.FORBIDDEN);
    }

    const permissions = SYSTEM_ROLE_PERMISSIONS[membership.role] ?? [];
    const can = (permission: string) => permissions.includes(permission);
    if (!can(required)) {
      throw new AppException(
        HttpStatus.FORBIDDEN,
        'You do not have permission to perform this support action',
        ErrorCode.FORBIDDEN,
      );
    }

    const profile = await this.usersRepo.findById(user.sub);
    return {
      orgId: org._id,
      orgSlug: org.slug,
      actorId: user.sub,
      actorName: profile?.name ?? user.email,
      actorEmail: user.email,
      permissions,
      can,
    };
  }

  /** Assignees must be active members who can work tickets (SUP-002). */
  async assertAssignable(orgId: string, userId: string): Promise<void> {
    const membership = await this.orgRepo.findMembership(orgId, userId);
    const permissions = membership ? (SYSTEM_ROLE_PERMISSIONS[membership.role] ?? []) : [];
    if (
      !membership ||
      membership.status !== MembershipStatus.Active ||
      !permissions.includes(SupportPermission.Write)
    ) {
      throw new AppException(
        HttpStatus.UNPROCESSABLE_ENTITY,
        'The assignee must be an active workspace member who can work on tickets',
        ErrorCode.UNPROCESSABLE,
        [{ field: 'assigneeId', message: 'Not an eligible support agent in this workspace' }],
      );
    }
  }
}
