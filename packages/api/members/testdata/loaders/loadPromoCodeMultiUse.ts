import { seedDynamoTable } from '@blc-mono/members/testdata/loaders/loader/databaseSeeder';
import { memberProfileTable } from '@blc-mono/members/testdata/loaders/constants/tables';
import { promoCodeMultiUse } from '@blc-mono/members/testdata/loaders/data/promoCodeMultiUse';

export async function loadPromoCodeMultiUse(): Promise<void> {
  try {
    await seedDynamoTable(memberProfileTable, promoCodeMultiUse);
    console.log('Seeding multi-use promo codes completed');
  } catch (error) {
    console.error('Seeding multi-use promo codes failed', error);
  }
}
