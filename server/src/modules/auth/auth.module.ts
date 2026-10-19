import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthGuard } from '@/common';
import { UsersModule } from '../users/users.module';
import { SessionsModule } from '../sessions/sessions.module';
import { EmailToken, EmailTokenSchema } from './schemas/email-token.schema';
import { EmailTokenRepository } from './email-token.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthTokenService } from './auth-token.service';

@Module({
  imports: [
    JwtModule.register({ global: true }),
    MongooseModule.forFeature([{ name: EmailToken.name, schema: EmailTokenSchema }]),
    UsersModule,
    SessionsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthTokenService, EmailTokenRepository, JwtAuthGuard],
  exports: [AuthService, AuthTokenService, JwtAuthGuard, JwtModule],
})
export class AuthModule {}
