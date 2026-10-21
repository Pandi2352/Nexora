import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import {
  REPLY_TYPES,
  TICKET_STATUSES,
  type ReplyType,
  type TicketStatus,
} from '../constants/support.constants';

export class CreateReplyDto {
  @ApiProperty({ enum: REPLY_TYPES, description: '`internal_note` is visible to staff only' })
  @IsIn(REPLY_TYPES)
  type: ReplyType;

  @ApiProperty({
    example: 'Thanks for reporting this. We have reproduced the issue and are working on a fix.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  body: string;

  @ApiPropertyOptional({
    enum: TICKET_STATUSES,
    description: '"Send and set status": move the ticket to this status after posting',
  })
  @IsOptional()
  @IsIn(TICKET_STATUSES)
  setStatus?: TicketStatus;
}
