import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { Connection } from 'mysql2/promise';

export interface IDatabaseConnection {
  readonly drizzleClient: MySql2Database<Record<string, never>>;
  readonly directConnection: Connection;
}
