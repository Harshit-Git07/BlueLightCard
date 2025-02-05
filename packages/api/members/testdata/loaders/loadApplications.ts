import { seedDynamoTable } from '@blc-mono/members/testdata/loaders/loader/databaseSeeder';
import { applications } from '@blc-mono/members/testdata/loaders/data/applications';
import { memberProfileTable } from '@blc-mono/members/testdata/loaders/constants/tables';

export async function loadApplications(): Promise<void> {
  try {
    await seedDynamoTable(memberProfileTable, applications);
    console.log('Seeding applications completed');
  } catch (error) {
    console.error('Seeding applications failed', error);
  }
}
