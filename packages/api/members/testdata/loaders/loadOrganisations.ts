import { seedDynamoTable } from '@blc-mono/members/testdata/loaders/loader/databaseSeeder';
import { memberOrganisationsTable } from '@blc-mono/members/testdata/loaders/constants/tables';
import { organisations } from '@blc-mono/members/testdata/loaders/data/organisations';

export async function loadOrganisations(): Promise<void> {
  try {
    await seedDynamoTable(memberOrganisationsTable, organisations);
    console.log('Seeding organisations completed');
  } catch (error) {
    console.error('Seeding organisations failed', error);
  }
}
