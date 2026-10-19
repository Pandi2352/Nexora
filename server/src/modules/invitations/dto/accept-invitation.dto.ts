import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class AcceptInvitationDto {
  @ApiProperty({ description: 'Single-use invitation token' })
  @IsString()
  token: string;

  @ApiPropertyOptional({ description: 'Full name for new user accounts' })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  name?: string;

  @ApiPropertyOptional({ description: 'Password for new user accounts' })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password?: string;
}
