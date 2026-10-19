import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'alex@example.com' })
  @IsEmail({}, { message: 'Must be a valid email address' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'P@ssword123!' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
