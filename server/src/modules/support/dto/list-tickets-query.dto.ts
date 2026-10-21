import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationDto } from '@/common';
import {
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  TICKET_SORT_FIELDS,
  TICKET_STATUSES,
  type TicketCategory,
  type TicketPriority,
} from '../constants/support.constants';

export const TICKET_VIEWS = ['all', 'active', ...TICKET_STATUSES] as const;
export type TicketView = (typeof TICKET_VIEWS)[number];

const UUID_OR_KEYWORD =
  /^(me|unassigned|[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i;

export class ListTicketsQueryDto extends PaginationDto {
  @ApiPropertyOptional({ enum: TICKET_SORT_FIELDS, default: 'lastActivityAt' })
  @IsOptional()
  @IsIn(TICKET_SORT_FIELDS)
  override sort: string = 'lastActivityAt';

  @ApiPropertyOptional({
    enum: TICKET_VIEWS,
    default: 'all',
    description: '`active` = not resolved/closed',
  })
  @IsOptional()
  @IsIn(TICKET_VIEWS)
  view?: TicketView;

  @ApiPropertyOptional({ enum: TICKET_PRIORITIES })
  @IsOptional()
  @IsIn(TICKET_PRIORITIES)
  priority?: TicketPriority;

  @ApiPropertyOptional({ enum: TICKET_CATEGORIES })
  @IsOptional()
  @IsIn(TICKET_CATEGORIES)
  category?: TicketCategory;

  @ApiPropertyOptional({ description: 'User UUID, `me` or `unassigned`' })
  @IsOptional()
  @Matches(UUID_OR_KEYWORD, { message: 'assignee must be a UUID, "me" or "unassigned"' })
  assignee?: string;

  @ApiPropertyOptional({
    enum: ['breached'],
    description: 'Only tickets past their resolution due date',
  })
  @IsOptional()
  @IsIn(['breached'])
  sla?: 'breached';

  @ApiPropertyOptional({ description: 'Exact tag' })
  @IsOptional()
  @IsString()
  tag?: string;
}
