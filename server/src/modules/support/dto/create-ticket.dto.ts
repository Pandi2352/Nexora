import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import {
  TICKET_CATEGORIES,
  TICKET_CHANNELS,
  TICKET_PRIORITIES,
  type TicketCategory,
  type TicketChannel,
  type TicketPriority,
} from '../constants/support.constants';

export class TicketRequesterDto {
  @ApiProperty({ example: 'Arun Kumar' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiProperty({ example: 'arun.kumar@acme.in' })
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiPropertyOptional({ example: '+91 98400 12345' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @ApiPropertyOptional({ example: 'Acme Industries' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  companyName?: string;
}

export class CreateTicketDto {
  @ApiProperty({ example: 'Unable to export invoices to PDF' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  subject: string;

  @ApiProperty({
    example: 'Clicking Export on the invoices page shows a blank screen since this morning.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10000)
  description: string;

  @ApiPropertyOptional({ enum: TICKET_PRIORITIES, default: 'medium' })
  @IsOptional()
  @IsIn(TICKET_PRIORITIES)
  priority?: TicketPriority;

  @ApiPropertyOptional({ enum: TICKET_CATEGORIES, default: 'general' })
  @IsOptional()
  @IsIn(TICKET_CATEGORIES)
  category?: TicketCategory;

  @ApiPropertyOptional({ enum: TICKET_CHANNELS, default: 'web' })
  @IsOptional()
  @IsIn(TICKET_CHANNELS)
  channel?: TicketChannel;

  @ApiProperty({ type: TicketRequesterDto })
  @ValidateNested()
  @Type(() => TicketRequesterDto)
  requester: TicketRequesterDto;

  @ApiPropertyOptional({ description: 'CRM contact in this workspace' })
  @IsOptional()
  @IsUUID('4')
  contactId?: string;

  @ApiPropertyOptional({ description: 'CRM company in this workspace' })
  @IsOptional()
  @IsUUID('4')
  companyId?: string;

  @ApiPropertyOptional({ description: 'Active workspace member who owns the ticket' })
  @IsOptional()
  @IsUUID('4')
  assigneeId?: string;

  @ApiPropertyOptional({ type: [String], example: ['invoices', 'export'] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @MaxLength(30, { each: true })
  tags?: string[];
}
