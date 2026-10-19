import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateOpportunityDto {
  @ApiProperty({ example: 'Cloud ERP Transformation Deal' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  companyId?: string;

  @ApiPropertyOptional({ example: 'Acme Global Inc' })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  leadId?: string;

  @ApiPropertyOptional({
    enum: ['qualification', 'needs_analysis', 'proposal_quote', 'negotiation', 'closed_won', 'closed_lost'],
    default: 'qualification',
  })
  @IsOptional()
  @IsEnum(['qualification', 'needs_analysis', 'proposal_quote', 'negotiation', 'closed_won', 'closed_lost'])
  stage?: string;

  @ApiProperty({ example: 2500000, description: 'Deal value in Indian Rupees (₹)' })
  @IsNumber()
  @Min(0)
  value: number;

  @ApiPropertyOptional({ example: 40, description: 'Win probability percentage (0 to 100)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  probability?: number;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsOptional()
  @IsDateString()
  expectedCloseDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  ownerId?: string;

  @ApiPropertyOptional({ default: false, description: 'Mark this deal as a must-win opportunity' })
  @IsOptional()
  @IsBoolean()
  isMustWin?: boolean;

  @ApiPropertyOptional({ example: 'NX-Q-2026-004' })
  @IsOptional()
  @IsString()
  quotationNumber?: string;

  @ApiPropertyOptional({ enum: ['draft', 'sent', 'accepted', 'declined'] })
  @IsOptional()
  @IsEnum(['draft', 'sent', 'accepted', 'declined'])
  quotationStatus?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}

export class UpdateOpportunityDto extends CreateOpportunityDto {}

export class UpdateOpportunityStageDto {
  @ApiProperty({
    enum: ['qualification', 'needs_analysis', 'proposal_quote', 'negotiation', 'closed_won', 'closed_lost'],
  })
  @IsEnum(['qualification', 'needs_analysis', 'proposal_quote', 'negotiation', 'closed_won', 'closed_lost'])
  @IsNotEmpty()
  stage: string;
}
