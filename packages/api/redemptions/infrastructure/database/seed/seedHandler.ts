import { DatabaseConnectionType } from '@blc-mono/redemptions/libs/database/connection';
import { withConnection } from '@blc-mono/redemptions/libs/database/connectionHelpers';

import { seed } from './seed';

export const handler = withConnection(DatabaseConnectionType.READ_WRITE, async (connection): Promise<void> => {
  // eslint-disable-next-line no-console
  console.log('🚀 Seeding database...');
  await seed(connection);
  // eslint-disable-next-line no-console
  console.log('✅ Database seeding complete!');
});
