import { DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';
import { withConnection } from '@blc-mono/redemptions/libs/database/connectionHelpers';

import { runMigrations } from './runMigrations';

export const MIGRATIONS_PATH = 'migrations';

export const handler = withConnection(DatabaseConnectionType.READ_WRITE, async (connection): Promise<void> => {
  console.log('🚀 Running migrations...');
  await runMigrations(connection, MIGRATIONS_PATH);
  console.log('✅ Migrations complete!');
});
