import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateSalesActivityDto {
  @ApiProperty({
    enum: ['cold_call', 'meeting', 'proposal_submitted', 'follow_up', 'email', 'note'],
  })
  @IsEnum(['cold_call', 'meeting', 'proposal_submitted', 'follow_up', 'email', 'note'])
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'Initial Discovery Cold Call' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional({ example: 'Spoke with CTO regarding enterprise cloud migration requirements.' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  companyId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  leadId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  contactId?: string;

  @ApiPropertyOptional({ example: '2026-10-25T10:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @ApiPropertyOptional({ example: '2026-10-19T14:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  completedAt?: string;

  @ApiPropertyOptional({ enum: ['scheduled', 'completed', 'cancelled'], default: 'completed' })
  @IsOptional()
  @IsEnum(['scheduled', 'completed', 'cancelled'])
  status?: string;

  @ApiPropertyOptional({ enum: ['positive', 'neutral', 'negative', 'followup_needed'] })
  @IsOptional()
  @IsEnum(['positive', 'neutral', 'negative', 'followup_needed'])
  outcome?: string;

  @ApiPropertyOptional({ example: 450000, description: 'Proposal amount in Indian Rupees (₹)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  proposalValue?: number;
}
