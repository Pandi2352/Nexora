import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class VerifyEmailDto {
  @ApiPropertyOptional({ description: '6-digit verification code sent to user email' })
  @IsOptional()
  @IsString()
  @Length(6, 6)
  code?: string;

  @ApiPropertyOptional({ description: 'User email address associated with the code' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'Direct verification token for backwards compatibility' })
  @IsOptional()
  @IsString()
  token?: string;
}

