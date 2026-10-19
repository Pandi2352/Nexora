import { HttpStatus, Injectable } from '@nestjs/common';
import { AppException, ErrorCode, StringUtil } from '@/common';
import { OrganizationsRepository } from './organizations.repository';
import type { CreateOrganizationDto, UpdateOrganizationDto } from './dto';
import {
  MembershipRole,
  MembershipStatus,
} from './schemas/membership.schema';
import {
  type OrganizationDocument,
  OrganizationStatus,
} from './schemas/organization.schema';

export interface WorkspaceSummary {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  role: string;
  timezone: string;
  locale: string;
  membersCount: number;
  createdAt: Date;
}

@Injectable()
export class OrganizationsService {
  constructor(private readonly orgRepo: OrganizationsRepository) {}

  async create(userId: string, dto: CreateOrganizationDto): Promise<WorkspaceSummary> {
    const baseSlug = StringUtil.slugify(dto.slug || dto.name) || 'workspace';
    let slug = baseSlug;
    let counter = 1;

    while (await this.orgRepo.findOrgBySlug(slug)) {
      slug = `${baseSlug}-${counter++}`;
    }

    const org = await this.orgRepo.createOrganization({
      name: dto.name.trim(),
      slug,
      timezone: dto.timezone || 'UTC',
      locale: dto.locale || 'en-US',
      ownerId: userId,
      status: OrganizationStatus.Active,
    });

    await this.orgRepo.createMembership({
      organizationId: org._id,
      userId,
      role: MembershipRole.Owner,
      status: MembershipStatus.Active,
      joinedAt: new Date(),
    });

    return {
      id: org._id,
      name: org.name,
      slug: org.slug,
      logoUrl: org.logoUrl,
      role: MembershipRole.Owner,
      timezone: org.timezone,
      locale: org.locale,
      membersCount: 1,
      createdAt: org.createdAt,
    };
  }

  async listUserOrganizations(userId: string): Promise<WorkspaceSummary[]> {
    const memberships = await this.orgRepo.findUserMemberships(userId, MembershipStatus.Active);
    const results: WorkspaceSummary[] = [];

    for (const membership of memberships) {
      const org = await this.orgRepo.findOrgById(membership.organizationId);
      if (!org || org.status === OrganizationStatus.Suspended) continue;

      const membersCount = await this.orgRepo.countMembers(org._id);
      results.push({
        id: org._id,
        name: org.name,
        slug: org.slug,
        logoUrl: org.logoUrl,
        role: membership.role,
        timezone: org.timezone,
        locale: org.locale,
        membersCount,
        createdAt: org.createdAt,
      });
    }

    return results;
  }

  async getByIdOrSlug(userId: string, idOrSlug: string): Promise<WorkspaceSummary> {
    const org = await this.orgRepo.findOrgByIdOrSlug(idOrSlug);
    if (!org) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Workspace not found', ErrorCode.NOT_FOUND);
    }

    const membership = await this.orgRepo.findMembership(org._id, userId);
    if (!membership || membership.status !== MembershipStatus.Active) {
      throw new AppException(
        HttpStatus.FORBIDDEN,
        'Access denied to this workspace',
        ErrorCode.FORBIDDEN,
      );
    }

    const membersCount = await this.orgRepo.countMembers(org._id);
    return {
      id: org._id,
      name: org.name,
      slug: org.slug,
      logoUrl: org.logoUrl,
      role: membership.role,
      timezone: org.timezone,
      locale: org.locale,
      membersCount,
      createdAt: org.createdAt,
    };
  }

  async update(
    userId: string,
    idOrSlug: string,
    dto: UpdateOrganizationDto,
  ): Promise<WorkspaceSummary> {
    const existing = await this.getByIdOrSlug(userId, idOrSlug);
    if (existing.role !== MembershipRole.Owner && existing.role !== MembershipRole.Admin) {
      throw new AppException(
        HttpStatus.FORBIDDEN,
        'Only owners and admins can update workspace settings',
        ErrorCode.FORBIDDEN,
      );
    }

    const updates: Partial<OrganizationDocument> = {};
    if (dto.name) updates.name = dto.name.trim();
    if (dto.logoUrl !== undefined) updates.logoUrl = dto.logoUrl;
    if (dto.timezone) updates.timezone = dto.timezone;
    if (dto.locale) updates.locale = dto.locale;

    if (dto.slug) {
      const normalizedSlug = StringUtil.slugify(dto.slug);
      if (normalizedSlug !== existing.slug) {
        const conflict = await this.orgRepo.findOrgBySlug(normalizedSlug);
        if (conflict) {
          throw new AppException(
            HttpStatus.CONFLICT,
            'Workspace slug is already in use',
            ErrorCode.CONFLICT,
          );
        }
        updates.slug = normalizedSlug;
      }
    }

    const updated = await this.orgRepo.updateOrganization(existing.id, updates);
    if (!updated) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Workspace not found', ErrorCode.NOT_FOUND);
    }

    return {
      id: updated._id,
      name: updated.name,
      slug: updated.slug,
      logoUrl: updated.logoUrl,
      role: existing.role,
      timezone: updated.timezone,
      locale: updated.locale,
      membersCount: existing.membersCount,
      createdAt: updated.createdAt,
    };
  }

  async leave(userId: string, idOrSlug: string): Promise<{ success: boolean; message: string }> {
    const existing = await this.getByIdOrSlug(userId, idOrSlug);

    if (existing.role === MembershipRole.Owner) {
      const ownerCount = await this.orgRepo.countOwners(existing.id);
      if (ownerCount <= 1) {
        throw new AppException(
          HttpStatus.BAD_REQUEST,
          'Cannot leave workspace as the sole owner. Transfer ownership first.',
          ErrorCode.BAD_REQUEST,
        );
      }
    }

    await this.orgRepo.removeMembership(existing.id, userId);
    return { success: true, message: 'Successfully left workspace' };
  }
}
