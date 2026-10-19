import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CompanyAddressDto {
  @ApiPropertyOptional({ example: '123 MG Road' })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiPropertyOptional({ example: 'Bengaluru' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'Karnataka' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: '560001' })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({ example: 'India' })
  @IsOptional()
  @IsString()
  country?: string;
}

export class CreateCompanyDto {
  @ApiProperty({ example: 'Acme Corp' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({ example: 'Technology' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  industry?: string;

  @ApiPropertyOptional({ example: 'https://acme.inc' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  website?: string;

  @ApiPropertyOptional({ example: '+91 98765 43210' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @ApiPropertyOptional({ example: 'contact@acme.inc' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ type: CompanyAddressDto })
  @IsOptional()
  @IsObject()
  address?: CompanyAddressDto;

  @ApiPropertyOptional({ example: 5000000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  annualRevenue?: number;

  @ApiPropertyOptional({ example: '51-200' })
  @IsOptional()
  @IsString()
  employeeCount?: string;

  @ApiPropertyOptional({ enum: ['prospect', 'customer', 'partner', 'inactive'] })
  @IsOptional()
  @IsEnum(['prospect', 'customer', 'partner', 'inactive'])
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  ownerId?: string;
}

export class UpdateCompanyDto extends CreateCompanyDto {}
