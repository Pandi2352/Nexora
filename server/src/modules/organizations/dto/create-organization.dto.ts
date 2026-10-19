import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty({ description: 'Workspace or company name', example: 'Acme Operations' })
  @IsString()
  @MinLength(2, { message: 'Organization name must be at least 2 characters' })
  @MaxLength(100, { message: 'Organization name cannot exceed 100 characters' })
  name: string;

  @ApiPropertyOptional({
    description: 'URL-friendly unique slug identifier',
    example: 'acme-operations',
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Slug must be at least 2 characters' })
  @MaxLength(60, { message: 'Slug cannot exceed 60 characters' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug?: string;

  @ApiPropertyOptional({ description: 'Default timezone', example: 'UTC' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ description: 'Default locale', example: 'en-US' })
  @IsOptional()
  @IsString()
  locale?: string;
}
