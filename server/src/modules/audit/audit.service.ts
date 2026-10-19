import { HttpStatus, Injectable } from '@nestjs/common';
import { AppException, ErrorCode } from '@/common';
import { OrganizationsRepository } from '../organizations/organizations.repository';
import { MembershipRole, MembershipStatus } from '../organizations/schemas/membership.schema';
import type { JwtPayload } from '../auth/auth.interface';
import { AuditRepository } from './audit.repository';
import { AuditStatus } from './schemas/audit-log.schema';
import type { ListAuditLogsQueryDto } from './dto/list-audit-logs.dto';

export interface CreateAuditLogParams {
  organizationId?: string;
  actorId: string;
  actorName?: string;
  actorEmail?: string;
  action: string;
  targetType: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  status?: AuditStatus;
}

@Injectable()
export class AuditService {
  constructor(
    private readonly auditRepo: AuditRepository,
    private readonly orgRepo: OrganizationsRepository,
  ) {}

  async log(params: CreateAuditLogParams) {
    try {
      const sanitized = params.metadata ? { ...params.metadata } : undefined;
      if (sanitized) {
        delete sanitized.password;
        delete sanitized.token;
        delete sanitized.refreshToken;
        delete sanitized.secret;
      }

      await this.auditRepo.createLog({
        organizationId: params.organizationId,
        actorId: params.actorId,
        actorName: params.actorName,
        actorEmail: params.actorEmail,
        action: params.action,
        targetType: params.targetType,
        targetId: params.targetId,
        metadata: sanitized,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
        requestId: params.requestId,
        status: params.status || AuditStatus.Success,
      });
    } catch {
      // Audit logging failures should never crash primary application requests
    }
  }

  async listAuditLogs(
    callerUser: JwtPayload,
    orgIdOrSlug: string,
    query: ListAuditLogsQueryDto,
  ) {
    const org = await this.orgRepo.findOrgByIdOrSlug(orgIdOrSlug);
    if (!org) {
      throw new AppException(HttpStatus.NOT_FOUND, 'Workspace not found', ErrorCode.NOT_FOUND);
    }

    const membership = await this.orgRepo.findMembership(org._id, callerUser.sub);
    if (!membership || membership.status !== MembershipStatus.Active) {
      throw new AppException(HttpStatus.FORBIDDEN, 'Access denied', ErrorCode.FORBIDDEN);
    }

    const allowed = [MembershipRole.Owner, MembershipRole.Admin, MembershipRole.Manager];
    if (!allowed.includes(membership.role)) {
      throw new AppException(HttpStatus.FORBIDDEN, 'Insufficient permissions to view audit logs', ErrorCode.FORBIDDEN);
    }

    const page = query.page || 1;
    const limit = query.limit || 30;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      this.auditRepo.listLogs(org._id, {
        action: query.action,
        actorId: query.actorId,
        skip,
        limit,
      }),
      this.auditRepo.countLogs(org._id, {
        action: query.action,
        actorId: query.actorId,
      }),
    ]);

    return {
      items: logs.map((log) => ({
        id: log._id,
        actorId: log.actorId,
        actorName: log.actorName || 'User',
        actorEmail: log.actorEmail || '',
        action: log.action,
        targetType: log.targetType,
        targetId: log.targetId,
        metadata: log.metadata,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        status: log.status,
        createdAt: log.createdAt,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }
}
