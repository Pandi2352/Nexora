import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
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

export class CreateLeadDto {
  @ApiProperty({ example: 'Nexora Innovations' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  companyName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  companyId?: string;

  // Lead Details
  @ApiPropertyOptional({ enum: ['new', 'contacted', 'in_discussion', 'qualified', 'proposal_sent', 'unqualified'] })
  @IsOptional()
  @IsEnum(['new', 'contacted', 'in_discussion', 'qualified', 'proposal_sent', 'unqualified'])
  status?: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d' })
  @IsUUID('4')
  @IsNotEmpty()
  leadOwnerId: string;

  @ApiPropertyOptional({ enum: ['website', 'referral', 'cold_call', 'linkedin', 'event', 'partner', 'other'] })
  @IsOptional()
  @IsEnum(['website', 'referral', 'cold_call', 'linkedin', 'event', 'partner', 'other'])
  source?: string;

  @ApiPropertyOptional({ enum: ['inbound', 'outbound', 'partner', 'expansion'] })
  @IsOptional()
  @IsEnum(['inbound', 'outbound', 'partner', 'expansion'])
  type?: string;

  @ApiPropertyOptional({ example: '2026-10-25T14:30:00.000Z' })
  @IsOptional()
  @IsDateString()
  meetingDate?: string;

  @ApiPropertyOptional({ example: '2026-10-28' })
  @IsOptional()
  @IsDateString()
  nextContactDate?: string;

  @ApiPropertyOptional({ example: '2026-11-15' })
  @IsOptional()
  @IsDateString()
  expectedConversionDate?: string;

  // Funnel Information
  @ApiPropertyOptional({ enum: ['enterprise', 'mid_market', 'smb', 'government', 'digital'] })
  @IsOptional()
  @IsEnum(['enterprise', 'mid_market', 'smb', 'government', 'digital'])
  businessUnit?: string;

  @ApiPropertyOptional({ enum: ['recurring', 'one_time', 'fixed_bid', 'time_and_materials'] })
  @IsOptional()
  @IsEnum(['recurring', 'one_time', 'fixed_bid', 'time_and_materials'])
  revenueType?: string;

  @ApiPropertyOptional({ enum: ['software_license', 'implementation', 'managed_services', 'consulting'] })
  @IsOptional()
  @IsEnum(['software_license', 'implementation', 'managed_services', 'consulting'])
  revenueCategory?: string;

  @ApiPropertyOptional({ enum: ['monthly', 'quarterly', 'annually', 'milestone'] })
  @IsOptional()
  @IsEnum(['monthly', 'quarterly', 'annually', 'milestone'])
  revenueFrequency?: string;

  @ApiPropertyOptional({ example: '2026-11' })
  @IsOptional()
  @IsString()
  billingStartMonth?: string;

  @ApiPropertyOptional({ example: 1500000, description: 'Annual revenue in Indian Rupees (₹)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  annualRevenueTarget?: number;

  @ApiPropertyOptional({ example: 2, description: 'Contract duration in years (0 to N)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50)
  contractPeriod?: number;

  @ApiPropertyOptional({ default: false, description: 'Mark this deal as a must-win opportunity' })
  @IsOptional()
  @IsBoolean()
  isMustWin?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  scope?: string;

  // Contact Information
  @ApiPropertyOptional({ example: 'Arun' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  contactFirstName?: string;

  @ApiPropertyOptional({ example: 'Kumar' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  contactLastName?: string;

  @ApiPropertyOptional({ example: 'Mr.' })
  @IsOptional()
  @IsString()
  salutation?: string;

  @ApiPropertyOptional({ enum: ['male', 'female', 'non_binary', 'prefer_not_to_say'] })
  @IsOptional()
  @IsEnum(['male', 'female', 'non_binary', 'prefer_not_to_say'])
  gender?: string;

  @ApiPropertyOptional({ example: 'Head of Procurement' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  designation?: string;

  @ApiPropertyOptional({ example: 'arun.kumar@nexora.inc' })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional({ example: '+91 98400 12345' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  contactPhone?: string;

  @ApiPropertyOptional({ example: '1990-04-12' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  contactDescription?: string;

  @ApiPropertyOptional({ example: 'https://linkedin.com/in/arunkumar' })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  linkedInUrl?: string;

  @ApiPropertyOptional({ example: '@arunkumar' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  twitterHandle?: string;

  @ApiPropertyOptional({ type: [Object] })
  @IsOptional()
  @IsArray()
  contacts?: any[];
}

export class UpdateLeadDto extends CreateLeadDto {}
