import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateContactDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID('4')
  companyId?: string;

  @ApiProperty({ example: 'Sundar' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ example: 'Rajan' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @ApiPropertyOptional({ example: 'Mr.' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  salutation?: string;

  @ApiPropertyOptional({ enum: ['male', 'female', 'non_binary', 'prefer_not_to_say'] })
  @IsOptional()
  @IsEnum(['male', 'female', 'non_binary', 'prefer_not_to_say'])
  gender?: string;

  @ApiPropertyOptional({ example: 'VP of Technology' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  designation?: string;

  @ApiProperty({ example: 'sundar@acme.inc' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ example: '+91 98765 12345' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @ApiPropertyOptional({ example: '1985-06-15' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ example: 'https://linkedin.com/in/sundarrajan' })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  linkedInUrl?: string;

  @ApiPropertyOptional({ example: '@sundarrajan' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  twitterHandle?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class UpdateContactDto extends CreateContactDto {}
