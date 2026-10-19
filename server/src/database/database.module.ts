import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Environment, type EnvironmentVariables } from '../config/env.validation';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvironmentVariables, true>) => ({
        uri: config.get('MONGODB_URI', { infer: true }),
        // Index builds are run by migrations in production, not on every boot.
        autoIndex: config.get('NODE_ENV', { infer: true }) !== Environment.Production,
        serverSelectionTimeoutMS: 5000,
      }),
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
