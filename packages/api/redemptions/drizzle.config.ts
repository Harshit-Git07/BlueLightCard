import type { Config } from 'drizzle-kit';

import { RedemptionsDatabaseConfigResolver } from './src/config/database';

const databaseConfig = RedemptionsDatabaseConfigResolver.fromEnvironmentVariablesLocal();

export default {
  schema: './src/database/schema.ts',
  out: './src/database/migrations',
  driver: 'pg',
  dbCredentials: {
    host: databaseConfig.host,
    user: databaseConfig.username,
    password: databaseConfig.password,
    database: databaseConfig.databaseName,
    port: databaseConfig.port,
  },
} satisfies Config;
