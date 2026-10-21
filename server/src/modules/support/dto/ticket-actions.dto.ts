import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import {
  RESOLUTION_TYPES,
  TICKET_STATUSES,
  type ResolutionType,
  type TicketStatus,
} from '../constants/support.constants';

export class ChangeTicketStatusDto {
  @ApiProperty({ enum: TICKET_STATUSES })
  @IsIn(TICKET_STATUSES)
  status: TicketStatus;

  @ApiPropertyOptional({ description: 'Reason recorded in the ticket history' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}

export class AssignTicketDto {
  @ApiProperty({ nullable: true, description: 'Workspace member UUID, or null to unassign' })
  @ValidateIf((_, value) => value !== null)
  @IsUUID('4')
  assigneeId: string | null;
}

export class ResolveTicketDto {
  @ApiProperty({ enum: RESOLUTION_TYPES })
  @IsIn(RESOLUTION_TYPES)
  type: ResolutionType;

  @ApiProperty({ example: 'Cleared the cached export template; exports work again.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  summary: string;
}

export class ReopenTicketDto {
  @ApiPropertyOptional({ example: 'Customer reports the issue is back.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
