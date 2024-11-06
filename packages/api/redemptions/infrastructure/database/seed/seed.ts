import { NewGenericEntity } from '@blc-mono/redemptions/application/repositories/GenericsRepository';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import {
  ballotEntriesPrefix,
  ballotEntriesTable,
  ballotEntryStatusEnum,
  ballotsPrefix,
  ballotsTable,
  genericsPrefix,
  genericsTable,
  integrationCodesPrefix,
  integrationCodesTable,
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
      companyId: 'company-9179',
      connection: 'affiliate',
      offerId: '8722',
      offerType: 'online',
      redemptionType: 'vault',
      url: 'https://www.awin1.com/',
    },
    {
      id: `${redemptionsPrefix}-8s7a3c8-13a8-4cf3-a072-9b08ecd9d534`,
      affiliate: 'awin',
      companyId: 'company-9179',
      connection: 'affiliate',
      offerId: '8723',
      offerType: 'online',
      redemptionType: 'vault',
      url: 'https://www.awin1.com/',
    },
    {
      id: `${redemptionsPrefix}-1s245ga-13a8-4cf3-a072-c8anm8sl0dm6`,
      affiliate: 'awin',
      companyId: 'company-9179',
      connection: 'affiliate',
      offerId: '8724',
      offerType: 'online',
      redemptionType: 'preApplied',
      url: 'https://www.awin1.com/',
    },
    {
      id: `${redemptionsPrefix}-2s356ga-24a8-5cf4-a083-c9anm9sl0dm7`,
      affiliate: null,
      companyId: 'company-9180',
      connection: 'direct',
      offerId: '8725',
      offerType: 'online',
      redemptionType: 'vault',
      url: 'https://www.eagle-eye-vault.com/',
    },
    {
      id: `${redemptionsPrefix}-ac2f068c-af40-4be9-b02a-c5b6a2f88bf0`,
      affiliate: null,
      companyId: 'company-9180',
      connection: 'direct',
      offerId: '8726',
      offerType: 'online',
      redemptionType: 'ballot',
      url: 'https://www.eagle-eye-vault.com/',
    },
  ] satisfies (typeof redemptionsTable.$inferInsert)[];
  await db.insert(redemptionsTable).values(redemptionsData).onConflictDoNothing();

  const genericsData: NewGenericEntity[] = [
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
      email: 'adminname@bluelightcard.co.uk',
      maxPerUser: 3,
      showQR: false,
      status: 'active',
      vaultType: 'standard',
      integrationId: '123456',
    },
    {
      id: `${vaultsPrefix}-a3fa14f4-81e2-45be-a5da-f1445641f378`,
      redemptionId: redemptionsData[1].id,
      alertBelow: 10,
      created: new Date('2024-02-06T14:48:00.000Z'),
      email: 'adminname@bluelightcard.co.uk',
      maxPerUser: 3,
      showQR: false,
      status: 'active',
      vaultType: 'legacy',
      integrationId: '123456',
    },
    {
      id: `${vaultsPrefix}-a4fa25f5-92e3-56be-a6da-f2555752f378`,
      redemptionId: redemptionsData[3].id,
      alertBelow: 10,
      created: new Date('2024-09-06T14:58:00.000Z'),
      email: 'adminname@bluelightcard.co.uk',
      maxPerUser: 3,
      showQR: false,
      status: 'active',
      vaultType: 'standard',
      integration: 'uniqodo',
      integrationId: '123456',
    },
  ] satisfies (typeof vaultsTable.$inferInsert)[];
  await db.insert(vaultsTable).values(vaultsData).onConflictDoNothing();

  const vaultBatchesData = [
    {
      id: `${vaultBatchesPrefix}-e4dafac0-2ebf-479e-9936-8d75a4780be4`,
      vaultId: vaultsData[0].id,
      file: 'codes.csv',
      expiry: new Date('2025-01-05T14:48:00.000Z'),
      created: new Date('2024-01-05T14:48:00.000Z'),
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

  const integrationCodesData = [
    {
      id: `${integrationCodesPrefix}-b9f784c4-c3c9-5cd7-bc73-2799bb5e62fd`,
      vaultId: vaultsData[2].id,
      code: 'EAGLE_EYE_CODE_01',
      created: new Date('2024-09-07T14:58:00.000Z'),
      expiry: new Date('2025-09-06T14:58:00.000Z'),
      memberId: '1234',
      integrationId: '123456',
      integration: 'eagleeye',
    },
  ] satisfies (typeof integrationCodesTable.$inferInsert)[];
  await db.insert(integrationCodesTable).values(integrationCodesData).onConflictDoNothing();

  const ballotsData = [
    {
      id: `${ballotsPrefix}-e9bb4f9a-1d76-4aea-9b08-e1511441e448`,
      redemptionId: redemptionsData[4].id,
      drawDate: new Date('2025-01-02T14:48:00.000Z'),
      totalTickets: 100,
      eventDate: new Date('2025-01-01T14:48:00.000Z'),
      offerName: 'Eagle eye offer',
      created: new Date('2025-01-15T13:48:00.000Z'),
    },
  ] satisfies (typeof ballotsTable.$inferInsert)[];
  await db.insert(ballotsTable).values(ballotsData).onConflictDoNothing();

  const ballotsEntriesData = [
    {
      id: `${ballotEntriesPrefix}-82c819c7-df10-4e63-ae0b-0ae945a1dbd7`,
      ballotId: ballotsData[0].id,
      entryDate: new Date('2025-01-02T14:48:00.000Z'),
      memberId: '12345',
      status: ballotEntryStatusEnum.enumValues[0],
      created: new Date('2025-01-15T13:48:00.000Z'),
    },
    {
      id: `${ballotEntriesPrefix}-c82d931e-6fd7-4d4b-bcc6-c2cfc872947f`,
      ballotId: ballotsData[0].id,
      entryDate: new Date('2025-01-02T15:48:00.000Z'),
      memberId: '12345',
      status: ballotEntryStatusEnum.enumValues[2],
      created: new Date('2025-01-15T13:48:00.000Z'),
    },
    {
      id: `${ballotEntriesPrefix}-0f235608-d9f5-45a0-9c9a-be87db1388fa`,
      ballotId: ballotsData[0].id,
      entryDate: new Date('2025-01-02T16:48:00.000Z'),
      memberId: '12345',
      status: ballotEntryStatusEnum.enumValues[3],
      created: new Date('2025-01-15T13:48:00.000Z'),
    },
  ] satisfies (typeof ballotEntriesTable.$inferInsert)[];
  await db.insert(ballotEntriesTable).values(ballotsEntriesData).onConflictDoNothing();
}
