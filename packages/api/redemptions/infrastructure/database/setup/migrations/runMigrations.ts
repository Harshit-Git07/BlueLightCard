import { migrate } from 'drizzle-orm/postgres-js/migrator';

import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';

export async function runMigrations({ db }: DatabaseConnection, path: string): Promise<void> {
  await migrate(db, { migrationsFolder: path });
}
