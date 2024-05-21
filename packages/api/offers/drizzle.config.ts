import { Config } from 'drizzle-kit';
import { defineConfig } from 'drizzle-kit';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { EnvironmentVariablesKeys } from './src/utils/environment-variables';

export default defineConfig({
  dialect: 'mysql',
  schema: './src/models/database/schema.ts',
  out: './src/constructs/database/migration/generatedFiles',
  dbCredentials: {
    host: getEnv(EnvironmentVariablesKeys.OFFERS_DATABASE_HOST),
    port: parseInt(getEnv(EnvironmentVariablesKeys.OFFERS_DATABASE_PORT)),
    user: getEnv(EnvironmentVariablesKeys.OFFERS_DATABASE_USER),
    password: getEnv(EnvironmentVariablesKeys.OFFERS_DATABASE_ROOT_PASSWORD),
    database: getEnv(EnvironmentVariablesKeys.OFFERS_DATABASE_NAME),
  },
}) satisfies Config;
