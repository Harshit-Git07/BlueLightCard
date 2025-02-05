import { seedDynamoTable } from '@blc-mono/members/testdata/loaders/loader/databaseSeeder';
import { memberOrganisationsTable } from '@blc-mono/members/testdata/loaders/constants/tables';
import { idRequirements } from '@blc-mono/members/testdata/loaders/data/idRequirementDocs';

export async function loadIdRequirements(): Promise<void> {
  try {
    await seedDynamoTable(memberOrganisationsTable, idRequirements);
    console.log('Seeding id requirements completed');
  } catch (error) {
    console.error('Seeding id requirements failed', error);
  }
}
