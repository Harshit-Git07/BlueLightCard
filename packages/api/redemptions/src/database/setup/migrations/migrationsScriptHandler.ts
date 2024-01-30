import { DatabaseConnectionType } from '../../connection';
import { withConnection } from '../../connectionHelpers';

import { runMigrations } from './runMigrations';

export const MIGRATIONS_PATH = 'migrations';

export const handler = withConnection(DatabaseConnectionType.READ_WRITE, async (connection): Promise<void> => {
  console.log('🚀 Running migrations...');
  await runMigrations(connection, MIGRATIONS_PATH);
  console.log('✅ Migrations complete!');
});
