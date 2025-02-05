import { seedDynamoTable } from '@blc-mono/members/testdata/loaders/loader/databaseSeeder';
import { memberOrganisationsTable } from '@blc-mono/members/testdata/loaders/constants/tables';
import { employers } from '@blc-mono/members/testdata/loaders/data/employers';

export async function loadEmployers(): Promise<void> {
  try {
    await seedDynamoTable(memberOrganisationsTable, employers);
    console.log('Seeding employers completed');
  } catch (error) {
    console.error('Seeding employers failed', error);
  }
}
