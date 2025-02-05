import { profiles } from '@blc-mono/members/testdata/loaders/data/profiles';
import { seedDynamoTable } from '@blc-mono/members/testdata/loaders/loader/databaseSeeder';
import { memberProfileTable } from '@blc-mono/members/testdata/loaders/constants/tables';

export async function loadProfiles(): Promise<void> {
  try {
    await seedDynamoTable(memberProfileTable, profiles);
    console.log('Seeding profiles completed');
  } catch (error) {
    console.error('Seeding profiles failed', error);
  }
}
