import { HttpStatus, Injectable } from '@nestjs/common';
import { AppException, ErrorCode } from '@/common';
import { UsersRepository } from '../users/users.repository';
import { OrganizationsRepository } from '../organizations/organizations.repository';
import { MembershipRole, MembershipStatus } from '../organizations/schemas/membership.schema';
import type { JwtPayload } from '../auth/auth.interface';

export interface WorkspaceMemberInfo {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
  status: string;
  joinedAt: Date;
}

@Injectable()
export class MembershipsService {
  constructor(
    private readonly orgRepo: OrganizationsRepository,
    private readonly usersRepo: UsersRepository,
  ) {}

  async listMembers(callerUser: JwtPayload, orgIdOrSlug: string): Promise<WorkspaceMemberInfo[]> {
    const org = await this.orgRepo.findOrgByIdOrSlug(orgIdOrSlug);
    if (!org) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Workspace not found', ErrorCode.NOT_FOUND);
    }

    const callerMembership = await this.orgRepo.findMembership(org._id, callerUser.sub);
    if (!callerMembership || callerMembership.status !== MembershipStatus.Active) {
      throw new AppException(HttpStatus.FORBIDDEN, 'Access denied', ErrorCode.FORBIDDEN);
    }

    const memberships = await this.orgRepo.findOrgMemberships(org._id);
    const members: WorkspaceMemberInfo[] = [];

    for (const m of memberships) {
      const user = await this.usersRepo.findById(m.userId);
      if (user) {
        members.push({
          id: m._id,
          userId: user._id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          role: m.role,
          status: m.status,
          joinedAt: m.joinedAt,
        });
      }
    }

    return members;
  }

  async updateRole(
    callerUser: JwtPayload,
    orgIdOrSlug: string,
    memberId: string,
    newRole: string,
  ): Promise<WorkspaceMemberInfo> {
    const org = await this.orgRepo.findOrgByIdOrSlug(orgIdOrSlug);
    if (!org) throw new AppException(HttpStatus.NOT_FOUND, 'Workspace not found', ErrorCode.NOT_FOUND);

    const callerMembership = await this.orgRepo.findMembership(org._id, callerUser.sub);
    if (
      !callerMembership ||
      (callerMembership.role !== MembershipRole.Owner && callerMembership.role !== MembershipRole.Admin)
    ) {
      throw new AppException(
        HttpStatus.FORBIDDEN,
        'Only owners and admins can update member roles',
        ErrorCode.FORBIDDEN,
      );
    }

    const memberships = await this.orgRepo.findOrgMemberships(org._id);
    const target = memberships.find((m) => m._id === memberId || m.userId === memberId);
    if (!target) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Member not found in workspace', ErrorCode.NOT_FOUND);
    }

    if (callerMembership.role === MembershipRole.Admin && newRole === MembershipRole.Owner) {
      throw new AppException(
        HttpStatus.FORBIDDEN,
        'Admins cannot promote a member to Owner. Transfer ownership is restricted to current Owners.',
        ErrorCode.FORBIDDEN,
      );
    }

    if (target.role === MembershipRole.Owner && newRole !== MembershipRole.Owner) {
      const ownerCount = await this.orgRepo.countOwners(org._id);
      if (ownerCount <= 1) {
        throw new AppException(
          HttpStatus.BAD_REQUEST,
          'Cannot demote the last remaining owner of the workspace',
          ErrorCode.BAD_REQUEST,
        );
      }
    }

    target.role = newRole as MembershipRole;
    await target.save();

    const user = await this.usersRepo.findById(target.userId);
    return {
      id: target._id,
      userId: target.userId,
      name: user?.name || 'Member',
      email: user?.email || '',
      avatarUrl: user?.avatarUrl,
      role: target.role,
      status: target.status,
      joinedAt: target.joinedAt,
    };
  }

  async removeMember(
    callerUser: JwtPayload,
    orgIdOrSlug: string,
    memberId: string,
  ): Promise<{ success: boolean; message: string }> {
    const org = await this.orgRepo.findOrgByIdOrSlug(orgIdOrSlug);
    if (!org) throw new AppException(HttpStatus.NOT_FOUND, 'Workspace not found', ErrorCode.NOT_FOUND);

    const callerMembership = await this.orgRepo.findMembership(org._id, callerUser.sub);
    if (
      !callerMembership ||
      (callerMembership.role !== MembershipRole.Owner && callerMembership.role !== MembershipRole.Admin)
    ) {
      throw new AppException(HttpStatus.FORBIDDEN, 'Access denied', ErrorCode.FORBIDDEN);
    }

    const memberships = await this.orgRepo.findOrgMemberships(org._id);
    const target = memberships.find((m) => m._id === memberId || m.userId === memberId);
    if (!target) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Member not found', ErrorCode.NOT_FOUND);
    }

    if (target.role === MembershipRole.Owner) {
      const ownerCount = await this.orgRepo.countOwners(org._id);
      if (ownerCount <= 1) {
        throw new AppException(
          HttpStatus.BAD_REQUEST,
          'Cannot remove the last owner of the workspace',
          ErrorCode.BAD_REQUEST,
        );
      }
    }

    await this.orgRepo.removeMembership(org._id, target.userId);
    return { success: true, message: 'Member removed from workspace' };
  }
}
