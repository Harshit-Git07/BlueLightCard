import { seedDynamoTable } from '@blc-mono/members/testdata/loaders/loader/databaseSeeder';
import { cards } from '@blc-mono/members/testdata/loaders/data/cards';
import { memberProfileTable } from '@blc-mono/members/testdata/loaders/constants/tables';

export async function loadCards(): Promise<void> {
  try {
    await seedDynamoTable(memberProfileTable, cards);
    console.log('Seeding cards completed');
  } catch (error) {
    console.error('Seeding cards failed', error);
  }
}
