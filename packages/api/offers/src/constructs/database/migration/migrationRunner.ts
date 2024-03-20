import { migrate } from 'drizzle-orm/mysql2/migrator';
import { MySql2Database } from 'drizzle-orm/mysql2/driver';

export async function migrationRunner(drizzleClient: MySql2Database<Record<string, never>>, folderPath: string) {
  await migrate(drizzleClient, { migrationsFolder: folderPath });
}
