import { HttpStatus, Injectable } from '@nestjs/common';
import { AppException, ErrorCode } from '@/common';
import { OrganizationsRepository } from '../organizations/organizations.repository';
import { MembershipStatus } from '../organizations/schemas/membership.schema';
import type { JwtPayload } from '../auth/auth.interface';
import {
  PERMISSION_DEFINITIONS,
  SYSTEM_ROLE_PERMISSIONS,
} from './permissions.constants';

export interface SystemRoleInfo {
  slug: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
  memberCount?: number;
}

const SYSTEM_ROLES: SystemRoleInfo[] = [
  {
    slug: 'owner',
    name: 'Owner',
    description: 'Full workspace authority, including ownership transfer, billing, and permanent deletion.',
    permissions: SYSTEM_ROLE_PERMISSIONS.owner,
    isSystem: true,
  },
  {
    slug: 'admin',
    name: 'Administrator',
    description: 'Manages workspace settings, member invitations, functional teams, and security configurations.',
    permissions: SYSTEM_ROLE_PERMISSIONS.admin,
    isSystem: true,
  },
  {
    slug: 'manager',
    name: 'Manager',
    description: 'Supervises operational records, assigns tasks, directs teams, and inspects activity logs.',
    permissions: SYSTEM_ROLE_PERMISSIONS.manager,
    isSystem: true,
  },
  {
    slug: 'member',
    name: 'Member',
    description: 'Standard collaborator. Can view teams, manage assigned tasks, and update CRM records.',
    permissions: SYSTEM_ROLE_PERMISSIONS.member,
    isSystem: true,
  },
  {
    slug: 'support_agent',
    name: 'Support Agent',
    description: 'Dedicated customer service role with access to tickets, CRM records, and team communications.',
    permissions: SYSTEM_ROLE_PERMISSIONS.support_agent,
    isSystem: true,
  },
];

@Injectable()
export class RolesService {
  constructor(private readonly orgRepo: OrganizationsRepository) {}

  private async resolveOrgAndMembership(callerUser: JwtPayload, orgIdOrSlug: string) {
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

  async getRoles(callerUser: JwtPayload, orgIdOrSlug: string): Promise<SystemRoleInfo[]> {
    const { org } = await this.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    const memberships = await this.orgRepo.findOrgMemberships(org._id);

    const counts: Record<string, number> = {};
    for (const m of memberships) {
      counts[m.role] = (counts[m.role] || 0) + 1;
    }

    return SYSTEM_ROLES.map((role) => ({
      ...role,
      memberCount: counts[role.slug] || 0,
    }));
  }

  async getPermissionsMatrix(callerUser: JwtPayload, orgIdOrSlug: string) {
    await this.resolveOrgAndMembership(callerUser, orgIdOrSlug);

    const categories = Array.from(new Set(PERMISSION_DEFINITIONS.map((p) => p.category)));
    const matrix = categories.map((cat) => ({
      category: cat,
      permissions: PERMISSION_DEFINITIONS.filter((p) => p.category === cat).map((p) => ({
        key: p.key,
        name: p.name,
        description: p.description,
        grantedRoles: SYSTEM_ROLES.filter((r) => r.permissions.includes(p.key)).map((r) => r.slug),
      })),
    }));

    return {
      roles: SYSTEM_ROLES.map(({ slug, name, description, isSystem }) => ({
        slug,
        name,
        description,
        isSystem,
      })),
      matrix,
    };
  }

  async getUserPermissions(callerUser: JwtPayload, orgIdOrSlug: string) {
    const { membership } = await this.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    const permissions = SYSTEM_ROLE_PERMISSIONS[membership.role] || [];

    return {
      role: membership.role,
      permissions,
    };
  }
}
