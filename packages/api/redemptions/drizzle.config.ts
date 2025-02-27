import type { Config } from 'drizzle-kit';
import { defineConfig } from 'drizzle-kit';

import { RedemptionsDatabaseConfigResolver } from './infrastructure/config/database';

const databaseConfig = RedemptionsDatabaseConfigResolver.fromEnvironmentVariablesLocal();

export default defineConfig({
  dialect: 'postgresql',
  schema: './libs/database/schema.ts',
  out: './infrastructure/database/migrations',
  dbCredentials: {
    host: databaseConfig.host,
    user: databaseConfig.username,
    password: databaseConfig.password,
    database: databaseConfig.databaseName,
    port: databaseConfig.port,
  },
}) satisfies Config;
