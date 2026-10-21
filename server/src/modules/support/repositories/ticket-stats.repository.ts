import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { addDays } from '@/common';
import {
  ACTIVE_STATUSES,
  TICKET_STATUSES,
  type TicketStatus,
} from '../constants/support.constants';
import { Ticket, type TicketDocument } from '../schemas/ticket.schema';

export interface TicketStats {
  byStatus: Record<TicketStatus | 'all' | 'active', number>;
  unassigned: number;
  mine: number;
  urgent: number;
  breached: number;
  resolvedLast7Days: number;
  /** Averages over tickets created in the last 30 days, in minutes (null when no data). */
  avgFirstResponseMinutes: number | null;
  avgResolutionMinutes: number | null;
}

const MINUTE = 60_000;

/** Dashboard numbers for the support module, in one aggregation round trip. */
@Injectable()
export class TicketStatsRepository {
  constructor(@InjectModel(Ticket.name) private readonly ticketModel: Model<TicketDocument>) {}

  async getStats(orgId: string, currentUserId: string): Promise<TicketStats> {
    const now = new Date();
    const active = { status: { $in: ACTIVE_STATUSES } };

    const [result] = await this.ticketModel
      .aggregate<Record<string, Array<Record<string, number | string | null>>>>([
        { $match: { organizationId: orgId, isDeleted: false } },
        {
          $facet: {
            byStatus: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
            unassigned: [{ $match: { ...active, assigneeId: null } }, { $count: 'n' }],
            mine: [{ $match: { ...active, assigneeId: currentUserId } }, { $count: 'n' }],
            urgent: [{ $match: { ...active, priority: 'urgent' } }, { $count: 'n' }],
            breached: [{ $match: { ...active, resolutionDueAt: { $lt: now } } }, { $count: 'n' }],
            resolved7: [{ $match: { resolvedAt: { $gte: addDays(now, -7) } } }, { $count: 'n' }],
            averages: [
              { $match: { createdAt: { $gte: addDays(now, -30) } } },
              {
                $group: {
                  _id: null,
                  firstResponse: { $avg: { $subtract: ['$firstRespondedAt', '$createdAt'] } },
                  resolution: { $avg: { $subtract: ['$resolvedAt', '$createdAt'] } },
                },
              },
            ],
          },
        },
      ])
      .exec();

    const count = (key: string) => Number(result?.[key]?.[0]?.n ?? 0);
    const byStatus = Object.fromEntries(
      TICKET_STATUSES.map((s) => [s, 0]),
    ) as TicketStats['byStatus'];
    for (const row of result?.byStatus ?? []) byStatus[row._id as TicketStatus] = Number(row.count);
    byStatus.all = TICKET_STATUSES.reduce((sum, s) => sum + byStatus[s], 0);
    byStatus.active = ACTIVE_STATUSES.reduce((sum, s) => sum + byStatus[s], 0);

    const averages = result?.averages?.[0];
    const toMinutes = (ms: unknown) => (typeof ms === 'number' ? Math.round(ms / MINUTE) : null);

    return {
      byStatus,
      unassigned: count('unassigned'),
      mine: count('mine'),
      urgent: count('urgent'),
      breached: count('breached'),
      resolvedLast7Days: count('resolved7'),
      avgFirstResponseMinutes: toMinutes(averages?.firstResponse),
      avgResolutionMinutes: toMinutes(averages?.resolution),
    };
  }
}
