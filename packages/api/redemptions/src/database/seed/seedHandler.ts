import { DatabaseConnectionType } from '../connection';
import { withConnection } from '../connectionHelpers';

import { seed } from './seed';

export const handler = withConnection(DatabaseConnectionType.READ_WRITE, async (connection): Promise<void> => {
  console.log('🚀 Seeding database...');
  await seed(connection);
  console.log('✅ Database seeding complete!');
});
