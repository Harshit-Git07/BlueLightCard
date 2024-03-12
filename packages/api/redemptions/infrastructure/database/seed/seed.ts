import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import {
  genericsPrefix,
  genericsTable,
  redemptionsPrefix,
  redemptionsTable,
  vaultBatchesPrefix,
  vaultBatchesTable,
  vaultCodesPrefix,
  vaultCodesTable,
  vaultsPrefix,
  vaultsTable,
} from '@blc-mono/redemptions/libs/database/schema';

export async function seed({ db }: DatabaseConnection): Promise<void> {
  const redemptionsData = [
    {
      id: `${redemptionsPrefix}-6db7a3c8-13a8-4cf3-a072-9b08ecd9d534`,
      affiliate: 'awin',
      companyId: 9179,
      connection: 'affiliate',
      offerId: 8722,
      offerType: 'online',
      platform: 'BLC_UK',
      redemptionType: 'vault',
      url: 'https://awin1.com/',
    },
    {
      id: `${redemptionsPrefix}-8s7a3c8-13a8-4cf3-a072-9b08ecd9d534`,
      affiliate: 'awin',
      companyId: 9179,
      connection: 'affiliate',
      offerId: 8723,
      offerType: 'online',
      platform: 'BLC_UK',
      redemptionType: 'vault',
      url: 'https://awin1.com/',
    },
  ] satisfies (typeof redemptionsTable.$inferInsert)[];
  await db.insert(redemptionsTable).values(redemptionsData).onConflictDoNothing();

  const genericsData: (typeof genericsTable.$inferInsert)[] = [
    {
      id: `${genericsPrefix}-b5761799-d552-4496-a46e-8ff43162dbdb`,
      redemptionId: redemptionsData[0].id,
      code: 'BLC25OFF',
    },
  ];
  await db.insert(genericsTable).values(genericsData).onConflictDoNothing();

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
      vaultType: 'standard',
      terms:
        'Cannot be used in conjunction with any other online and/or instore promotion. Excludes clearance lines. Online offer only.',
    },
    {
      id: `${vaultsPrefix}-a3fa14f4-81e2-45be-a5da-f1445641f378`,
      redemptionId: redemptionsData[1].id,
      alertBelow: 10,
      created: new Date('2024-02-06T14:48:00.000Z'),
      email: 'admin@bluelightcard.co.uk',
      maxPerUser: 3,
      showQR: false,
      status: 'active',
      vaultType: 'legacy',
      terms:
        'Cannot be used in conjunction with any other online and/or instore promotion. Excludes clearance lines. Online offer only.',
    },
  ] satisfies (typeof vaultsTable.$inferInsert)[];
  await db.insert(vaultsTable).values(vaultsData).onConflictDoNothing();

  const vaultBatchesData = [
    {
      id: `${vaultBatchesPrefix}-e4dafac0-2ebf-479e-9936-8d75a4780be4`,
      vaultId: vaultsData[0].id,
      file: 'codes.csv',
    },
  ] satisfies (typeof vaultBatchesTable.$inferInsert)[];
  await db.insert(vaultBatchesTable).values(vaultBatchesData).onConflictDoNothing();

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
  ] satisfies (typeof vaultCodesTable.$inferInsert)[];
  await db.insert(vaultCodesTable).values(vaultCodesData).onConflictDoNothing();
}
