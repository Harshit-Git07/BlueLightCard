import { seedDynamoTable } from '@blc-mono/members/testdata/loaders/loader/databaseSeeder';
import { memberProfileTable } from '@blc-mono/members/testdata/loaders/constants/tables';
import { promoCodeSingleUse } from '@blc-mono/members/testdata/loaders/data/promoCodeSingleUse';

export async function loadPromoCodeSingleUse(): Promise<void> {
  try {
    await seedDynamoTable(memberProfileTable, promoCodeSingleUse);
    console.log('Seeding single-use promo codes completed');
  } catch (error) {
    console.error('Seeding single-use promo codes failed', error);
  }
}
