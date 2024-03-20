import { Config } from 'drizzle-kit';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { EnvironmentVariablesKeys } from './src/utils/environment-variables';

export default {
  schema: './src/models/database/schema.ts',
  out: './src/constructs/database/migration/generatedFiles',
  driver: 'mysql2',
  dbCredentials: {
    host: getEnv(EnvironmentVariablesKeys.OFFERS_DATABASE_HOST),
    port: parseInt(getEnv(EnvironmentVariablesKeys.OFFERS_DATABASE_PORT)),
    user: getEnv(EnvironmentVariablesKeys.OFFERS_DATABASE_USER),
    password: getEnv(EnvironmentVariablesKeys.OFFERS_DATABASE_ROOT_PASSWORD),
    database: getEnv(EnvironmentVariablesKeys.OFFERS_DATABASE_NAME),
  },
} satisfies Config;
