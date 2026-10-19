import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import {
  AllExceptionsFilter,
  createValidationPipe,
  requestIdMiddleware,
  setupSwagger,
} from '@/common';
import { Environment, type EnvironmentVariables } from './config/env.validation';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bodyParser: false });
  const config = app.get<ConfigService<EnvironmentVariables, true>>(ConfigService);

  const port = config.get('PORT', { infer: true });
  const apiPrefix = config.get('API_PREFIX', { infer: true });
  const isProduction = config.get('NODE_ENV', { infer: true }) === Environment.Production;

  app.use(requestIdMiddleware);
  app.use(cookieParser());
  app.use(helmet());
  app.useBodyParser('json', { limit: config.get('BODY_LIMIT', { infer: true }) });
  // Same-origin in production (reverse proxy); CORS only for the configured app origin.
  app.enableCors({ origin: config.get('APP_ORIGIN', { infer: true }), credentials: true });
  app.setGlobalPrefix(apiPrefix);
  app.useGlobalPipes(createValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter(!isProduction));
  app.enableShutdownHooks();

  if (!isProduction) setupSwagger(app, 'docs');

  await app.listen(port);
  logger.log(`Nexora OS API on http://localhost:${port}/${apiPrefix}`);
  if (!isProduction) logger.log(`Swagger docs on http://localhost:${port}/docs`);
}

void bootstrap();
