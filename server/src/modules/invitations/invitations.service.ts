import { HttpStatus, Injectable } from '@nestjs/common';
import { AppException, DateUtil, ErrorCode, HashUtil, StringUtil } from '@/common';
import { EmailService } from '@/integrations/email';
import { UsersRepository } from '../users/users.repository';
import { OrganizationsRepository } from '../organizations/organizations.repository';
import { MembershipRole, MembershipStatus } from '../organizations/schemas/membership.schema';
import { InvitationsRepository } from './invitations.repository';
import { InvitationStatus } from './schemas/invitation.schema';
import type { AcceptInvitationDto, CreateInvitationDto } from './dto';
import type { JwtPayload } from '../auth/auth.interface';

@Injectable()
export class InvitationsService {
  constructor(
    private readonly inviteRepo: InvitationsRepository,
    private readonly orgRepo: OrganizationsRepository,
    private readonly usersRepo: UsersRepository,
    private readonly emailService: EmailService,
  ) {}

  async invite(callerUser: JwtPayload, orgIdOrSlug: string, dto: CreateInvitationDto) {
    const org = await this.orgRepo.findOrgByIdOrSlug(orgIdOrSlug);
    if (!org) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Workspace not found', ErrorCode.NOT_FOUND);
    }

    const callerMembership = await this.orgRepo.findMembership(org._id, callerUser.sub);
    if (
      !callerMembership ||
      (callerMembership.role !== MembershipRole.Owner && callerMembership.role !== MembershipRole.Admin)
    ) {
      throw new AppException(
        HttpStatus.FORBIDDEN,
        'Only owners and admins can invite members',
        ErrorCode.FORBIDDEN,
      );
    }

    const normalizedEmail = StringUtil.normalizeEmail(dto.email);
    const existingUser = await this.usersRepo.findByEmail(normalizedEmail);
    if (existingUser) {
      const existingMember = await this.orgRepo.findMembership(org._id, existingUser._id);
      if (existingMember && existingMember.status === MembershipStatus.Active) {
        throw new AppException(
          HttpStatus.CONFLICT,
          'User is already an active member of this workspace',
          ErrorCode.CONFLICT,
        );
      }
    }

    const rawToken = HashUtil.randomToken(32);
    const tokenHash = HashUtil.sha256(rawToken);
    const expiresAt = DateUtil.addDays(new Date(), 7);

    const pending = await this.inviteRepo.findPendingByOrgAndEmail(org._id, normalizedEmail);
    let invite = pending;
    if (pending) {
      invite = await this.inviteRepo.update(pending._id, {
        tokenHash,
        expiresAt,
        role: dto.role,
        invitedById: callerUser.sub,
      });
    } else {
      invite = await this.inviteRepo.create({
        organizationId: org._id,
        email: normalizedEmail,
        role: dto.role,
        invitedById: callerUser.sub,
        tokenHash,
        status: InvitationStatus.Pending,
        expiresAt,
      });
    }

    const callerDoc = await this.usersRepo.findById(callerUser.sub);
    const inviterName = callerDoc?.name || 'A team member';

    void this.emailService.sendInvitationEmail(
      normalizedEmail,
      inviterName,
      org.name,
      dto.role,
      rawToken,
    );

    return {
      id: invite!._id,
      email: invite!.email,
      role: invite!.role,
      status: invite!.status,
      expiresAt: invite!.expiresAt,
    };
  }

  async listPending(callerUser: JwtPayload, orgIdOrSlug: string) {
    const org = await this.orgRepo.findOrgByIdOrSlug(orgIdOrSlug);
    if (!org) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Workspace not found', ErrorCode.NOT_FOUND);
    }

    const membership = await this.orgRepo.findMembership(org._id, callerUser.sub);
    if (!membership || membership.status !== MembershipStatus.Active) {
      throw new AppException(HttpStatus.FORBIDDEN, 'Access denied', ErrorCode.FORBIDDEN);
    }

    const invites = await this.inviteRepo.findPendingByOrg(org._id);
    return invites.map((inv) => ({
      id: inv._id,
      email: inv.email,
      role: inv.role,
      status: inv.status,
      expiresAt: inv.expiresAt,
      createdAt: inv.createdAt,
    }));
  }

  async revoke(callerUser: JwtPayload, orgIdOrSlug: string, inviteId: string) {
    const org = await this.orgRepo.findOrgByIdOrSlug(orgIdOrSlug);
    if (!org) throw new AppException(HttpStatus.NOT_FOUND, 'Workspace not found', ErrorCode.NOT_FOUND);

    const callerMembership = await this.orgRepo.findMembership(org._id, callerUser.sub);
    if (
      !callerMembership ||
      (callerMembership.role !== MembershipRole.Owner && callerMembership.role !== MembershipRole.Admin)
    ) {
      throw new AppException(HttpStatus.FORBIDDEN, 'Access denied', ErrorCode.FORBIDDEN);
    }

    await this.inviteRepo.update(inviteId, { status: InvitationStatus.Revoked });
    return { success: true, message: 'Invitation revoked successfully' };
  }

  async accept(dto: AcceptInvitationDto, callerUser?: JwtPayload) {
    const tokenHash = HashUtil.sha256(dto.token);
    const invite = await this.inviteRepo.findByTokenHash(tokenHash);

    if (!invite || invite.status !== InvitationStatus.Pending || DateUtil.isExpired(invite.expiresAt)) {
      throw new AppException(
        HttpStatus.BAD_REQUEST,
        'Invalid or expired invitation token',
        ErrorCode.BAD_REQUEST,
      );
    }

    const org = await this.orgRepo.findOrgById(invite.organizationId);
    if (!org) throw new AppException(HttpStatus.NOT_FOUND, 'Workspace not found', ErrorCode.NOT_FOUND);

    let targetUserId = callerUser?.sub;
    if (!targetUserId) {
      const existingUser = await this.usersRepo.findByEmail(invite.email);
      if (existingUser) {
        throw new AppException(
          HttpStatus.BAD_REQUEST,
          'Account already exists for this email. Please sign in to accept the invitation.',
          ErrorCode.BAD_REQUEST,
        );
      }

      if (!dto.name || !dto.password) {
        throw new AppException(
          HttpStatus.BAD_REQUEST,
          'Full name and password are required to create your account',
          ErrorCode.BAD_REQUEST,
        );
      }

      const passwordHash = await HashUtil.hashPassword(dto.password);
      const newUser = await this.usersRepo.create({
        email: invite.email,
        name: dto.name.trim(),
        passwordHash,
        isEmailVerified: true,
      });
      targetUserId = newUser._id;
    }

    const existingMember = await this.orgRepo.findMembership(org._id, targetUserId);
    if (!existingMember) {
      await this.orgRepo.createMembership({
        organizationId: org._id,
        userId: targetUserId,
        role: invite.role as MembershipRole,
        status: MembershipStatus.Active,
        joinedAt: new Date(),
      });
    }

    await this.inviteRepo.update(invite._id, { status: InvitationStatus.Accepted });

    return {
      organizationId: org._id,
      slug: org.slug,
      name: org.name,
      message: 'Workspace invitation accepted successfully',
    };
  }
}
