import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendVerificationDto {
  @ApiProperty({ example: 'alex@example.com' })
  @IsEmail({}, { message: 'Must be a valid email address' })
  @IsNotEmpty()
  email: string;
}
