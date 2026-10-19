import { plainToInstance } from 'class-transformer';
import { IsEnum, IsInt, IsString, IsUrl, Matches, Max, Min, validateSync } from 'class-validator';

export enum Environment {
  Development = 'development',
  Test = 'test',
  Production = 'production',
}

/** Every environment variable the server reads. Validated once at startup. */
export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @IsInt()
  @Min(1)
  @Max(65535)
  PORT: number = 3000;

  @IsString()
  API_PREFIX: string = 'api/v1';

  @IsUrl({ require_tld: false, protocols: ['http', 'https'] })
  APP_ORIGIN: string;

  @Matches(/^mongodb(\+srv)?:\/\//, {
    message: 'MONGODB_URI must be a mongodb:// or mongodb+srv:// URI',
  })
  MONGODB_URI: string;

  @Matches(/^\d+(b|kb|mb)$/i, { message: 'BODY_LIMIT must look like 100kb or 1mb' })
  BODY_LIMIT: string = '1mb';
}

/** Used by ConfigModule. Throws (and stops startup) when the environment is invalid. */
export function validateEnv(config: Record<string, unknown>): EnvironmentVariables {
  const env = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true });
  const errors = validateSync(env, { skipMissingProperties: false });

  if (errors.length > 0) {
    const problems = errors
      .map((error) => `  - ${error.property}: ${Object.values(error.constraints ?? {}).join(', ')}`)
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${problems}`);
  }

  return env;
}
