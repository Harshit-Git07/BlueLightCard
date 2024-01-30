import { DatabaseConnection } from '../connection';
import {
  generics,
  genericsPrefix,
  redemptions,
  redemptionsPrefix,
  vaultBatches,
  vaultBatchesPrefix,
  vaultCodes,
  vaultCodesPrefix,
  vaults,
  vaultsPrefix,
} from '../schema';

export async function seed({ db }: DatabaseConnection): Promise<void> {
  const redemptionsData = [
    {
      id: `${redemptionsPrefix}-6db7a3c8-13a8-4cf3-a072-9b08ecd9d534`,
      affiliate: 'awin',
      companyId: '9179',
      connection: 'affiliate',
      offerId: '8722',
      offerType: 'online',
      platform: 'BLC_UK',
      redemptionType: 'vault',
      url: 'https://awin1.com/',
    },
  ] satisfies (typeof redemptions.$inferInsert)[];
  await db.insert(redemptions).values(redemptionsData).onConflictDoNothing();

  const genericsData: (typeof generics.$inferInsert)[] = [
    {
      id: `${genericsPrefix}-b5761799-d552-4496-a46e-8ff43162dbdb`,
      redemptionId: redemptionsData[0].id,
      code: 'BLC25OFF',
    },
  ];
  await db.insert(generics).values(genericsData).onConflictDoNothing();

  const vaultsData = [
    {
      id: `${vaultsPrefix}-bbe8558f-dc4b-447a-bc62-381755c70174`,
      redemptionId: redemptionsData[0].id,
      alertBelow: 10,
      created: new Date('2024-01-05T14:48:00.000Z'),
      email: 'admin@bluelightcard.co.uk',
      maxPerUser: 3,
      showQR: false,
      status: 'active',
      terms:
        'Cannot be used in conjunction with any other online and/or instore promotion. Excludes clearance lines. Online offer only.',
    },
  ] satisfies (typeof vaults.$inferInsert)[];
  await db.insert(vaults).values(vaultsData).onConflictDoNothing();

  const vaultBatchesData = [
    {
      id: `${vaultBatchesPrefix}-e4dafac0-2ebf-479e-9936-8d75a4780be4`,
      vaultId: vaultsData[0].id,
      file: 'codes.csv',
    },
  ] satisfies (typeof vaultBatches.$inferInsert)[];
  await db.insert(vaultBatches).values(vaultBatchesData).onConflictDoNothing();

  const vaultCodesData = [
    {
      id: `${vaultCodesPrefix}-b8f674c3-c2c8-4cd6-bc62-1688bb4e62fd`,
      vaultId: vaultsData[0].id,
      batchId: vaultBatchesData[0].id,
      code: 'BLC25OFF-EXE123',
      created: new Date('2024-01-05T14:48:00.000Z'),
      expiry: new Date('2025-01-05T14:48:00.000Z'),
      memberId: '1234',
    },
  ] satisfies (typeof vaultCodes.$inferInsert)[];
  await db.insert(vaultCodes).values(vaultCodesData).onConflictDoNothing();
}
