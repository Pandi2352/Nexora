import { HttpStatus, Injectable } from '@nestjs/common';
import { AppException, ErrorCode } from '@/common';
import { OrganizationsRepository } from '../organizations/organizations.repository';
import { MembershipRole, MembershipStatus } from '../organizations/schemas/membership.schema';
import { UsersRepository } from '../users/users.repository';
import type { JwtPayload } from '../auth/auth.interface';
import { TeamsRepository } from './teams.repository';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

export interface TeamMemberInfo {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isLead: boolean;
  joinedAt: Date;
}

export interface TeamSummary {
  id: string;
  name: string;
  description?: string;
  leadUserId?: string;
  lead?: { id: string; name: string; email: string; avatarUrl?: string };
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class TeamsService {
  constructor(
    private readonly teamsRepo: TeamsRepository,
    private readonly orgRepo: OrganizationsRepository,
    private readonly usersRepo: UsersRepository,
  ) {}

  private async resolveOrgAndMembership(callerUser: JwtPayload, orgIdOrSlug: string, requireManage = false) {
    const org = await this.orgRepo.findOrgByIdOrSlug(orgIdOrSlug);
    if (!org) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Workspace not found', ErrorCode.NOT_FOUND);
    }
    const membership = await this.orgRepo.findMembership(org._id, callerUser.sub);
    if (!membership || membership.status !== MembershipStatus.Active) {
      throw new AppException(HttpStatus.FORBIDDEN, 'Access denied', ErrorCode.FORBIDDEN);
    }
    if (requireManage) {
      const allowedRoles = [MembershipRole.Owner, MembershipRole.Admin, MembershipRole.Manager];
      if (!allowedRoles.includes(membership.role)) {
        throw new AppException(HttpStatus.FORBIDDEN, 'Insufficient permissions to manage teams', ErrorCode.FORBIDDEN);
      }
    }
    return { org, membership };
  }

  async listTeams(callerUser: JwtPayload, orgIdOrSlug: string): Promise<TeamSummary[]> {
    const { org } = await this.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    const teams = await this.teamsRepo.listTeams(org._id);
    const memberCounts = await this.teamsRepo.countMembersByTeams(org._id);

    const summaries: TeamSummary[] = [];
    for (const team of teams) {
      let lead: TeamSummary['lead'] | undefined;
      if (team.leadUserId) {
        const leadUser = await this.usersRepo.findById(team.leadUserId);
        if (leadUser) {
          lead = {
            id: leadUser._id,
            name: leadUser.name,
            email: leadUser.email,
            avatarUrl: leadUser.avatarUrl,
          };
        }
      }
      summaries.push({
        id: team._id,
        name: team.name,
        description: team.description,
        leadUserId: team.leadUserId,
        lead,
        memberCount: memberCounts[team._id] ?? 0,
        createdAt: team.createdAt,
        updatedAt: team.updatedAt,
      });
    }
    return summaries;
  }

  async createTeam(callerUser: JwtPayload, orgIdOrSlug: string, dto: CreateTeamDto): Promise<TeamSummary> {
    const { org } = await this.resolveOrgAndMembership(callerUser, orgIdOrSlug, true);
    const existing = await this.teamsRepo.findTeamByName(org._id, dto.name);
    if (existing) {
      throw new AppException(HttpStatus.CONFLICT, `Team with name "${dto.name}" already exists`, ErrorCode.CONFLICT);
    }

    if (dto.leadUserId) {
      const leadMember = await this.orgRepo.findMembership(org._id, dto.leadUserId);
      if (!leadMember || leadMember.status !== MembershipStatus.Active) {
        throw new AppException(HttpStatus.BAD_REQUEST, 'Selected team lead is not an active workspace member', ErrorCode.VALIDATION_ERROR);
      }
    }

    const team = await this.teamsRepo.createTeam({
      organizationId: org._id,
      name: dto.name.trim(),
      description: dto.description?.trim(),
      leadUserId: dto.leadUserId,
      createdBy: callerUser.sub,
    });

    if (dto.leadUserId) {
      await this.teamsRepo.addMembership(org._id, team._id, dto.leadUserId);
    }

    return (await this.listTeams(callerUser, orgIdOrSlug)).find((t) => t.id === team._id)!;
  }

  async getTeam(callerUser: JwtPayload, orgIdOrSlug: string, teamId: string) {
    const { org } = await this.resolveOrgAndMembership(callerUser, orgIdOrSlug);
    const team = await this.teamsRepo.findTeamById(org._id, teamId);
    if (!team) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Team not found', ErrorCode.NOT_FOUND);
    }

    const memberships = await this.teamsRepo.findMembershipsByTeam(org._id, teamId);
    const members: TeamMemberInfo[] = [];

    for (const m of memberships) {
      const user = await this.usersRepo.findById(m.userId);
      if (user) {
        members.push({
          id: m._id,
          userId: user._id,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
          isLead: team.leadUserId === user._id,
          joinedAt: m.joinedAt,
        });
      }
    }

    return {
      id: team._id,
      name: team.name,
      description: team.description,
      leadUserId: team.leadUserId,
      members,
      memberCount: members.length,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    };
  }

  async updateTeam(callerUser: JwtPayload, orgIdOrSlug: string, teamId: string, dto: UpdateTeamDto) {
    const { org } = await this.resolveOrgAndMembership(callerUser, orgIdOrSlug, true);
    const team = await this.teamsRepo.findTeamById(org._id, teamId);
    if (!team) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Team not found', ErrorCode.NOT_FOUND);
    }

    if (dto.name && dto.name.trim().toLowerCase() !== team.name.toLowerCase()) {
      const existing = await this.teamsRepo.findTeamByName(org._id, dto.name);
      if (existing && existing._id !== team._id) {
        throw new AppException(HttpStatus.CONFLICT, `Team with name "${dto.name}" already exists`, ErrorCode.CONFLICT);
      }
    }

    if (dto.leadUserId) {
      const leadMember = await this.orgRepo.findMembership(org._id, dto.leadUserId);
      if (!leadMember || leadMember.status !== MembershipStatus.Active) {
        throw new AppException(HttpStatus.BAD_REQUEST, 'Selected team lead is not an active workspace member', ErrorCode.VALIDATION_ERROR);
      }
      await this.teamsRepo.addMembership(org._id, team._id, dto.leadUserId);
    }

    const updated = await this.teamsRepo.updateTeam(org._id, teamId, {
      ...(dto.name !== undefined ? { name: dto.name.trim() } : {}),
      ...(dto.description !== undefined ? { description: dto.description.trim() } : {}),
      ...(dto.leadUserId !== undefined ? { leadUserId: dto.leadUserId ?? undefined } : {}),
      updatedBy: callerUser.sub,
    });

    return updated;
  }

  async deleteTeam(callerUser: JwtPayload, orgIdOrSlug: string, teamId: string) {
    const { org } = await this.resolveOrgAndMembership(callerUser, orgIdOrSlug, true);
    const team = await this.teamsRepo.findTeamById(org._id, teamId);
    if (!team) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Team not found', ErrorCode.NOT_FOUND);
    }

    await this.teamsRepo.deleteMembershipsByTeam(org._id, teamId);
    await this.teamsRepo.deleteTeam(org._id, teamId);
    return { success: true };
  }

  async addMembers(callerUser: JwtPayload, orgIdOrSlug: string, teamId: string, userIds: string[]) {
    const { org } = await this.resolveOrgAndMembership(callerUser, orgIdOrSlug, true);
    const team = await this.teamsRepo.findTeamById(org._id, teamId);
    if (!team) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Team not found', ErrorCode.NOT_FOUND);
    }

    for (const userId of userIds) {
      const member = await this.orgRepo.findMembership(org._id, userId);
      if (member && member.status === MembershipStatus.Active) {
        await this.teamsRepo.addMembership(org._id, teamId, userId);
      }
    }

    return this.getTeam(callerUser, orgIdOrSlug, teamId);
  }

  async removeMember(callerUser: JwtPayload, orgIdOrSlug: string, teamId: string, userId: string) {
    const { org } = await this.resolveOrgAndMembership(callerUser, orgIdOrSlug, true);
    const team = await this.teamsRepo.findTeamById(org._id, teamId);
    if (!team) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Team not found', ErrorCode.NOT_FOUND);
    }

    await this.teamsRepo.removeMembership(org._id, teamId, userId);
    if (team.leadUserId === userId) {
      await this.teamsRepo.updateTeam(org._id, teamId, { leadUserId: undefined });
    }

    return { success: true };
  }
}
