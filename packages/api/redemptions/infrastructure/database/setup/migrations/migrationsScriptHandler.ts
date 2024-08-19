import { DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';
import { getConnection } from '@blc-mono/redemptions/libs/database/connectionHelpers';

import { runMigrations } from './runMigrations';

export const MIGRATIONS_PATH = 'migrations';

export const handler = async () => {
  const connection = await getConnection(DatabaseConnectionType.READ_WRITE);

  try {
    // eslint-disable-next-line no-console
    console.log('🚀 Running migrations...');
    await runMigrations(connection, MIGRATIONS_PATH);
    // eslint-disable-next-line no-console
    console.log('✅ Migrations complete!');
  } finally {
    await connection.close();
  }
};
