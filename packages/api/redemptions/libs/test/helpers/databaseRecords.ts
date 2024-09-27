import { faker } from '@faker-js/faker';

import { VaultCodeEntity } from '@blc-mono/redemptions/application/repositories/VaultCodesRepository';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import {
  redemptionsTable,
  vaultBatchesTable,
  vaultCodesTable,
  vaultsTable,
} from '@blc-mono/redemptions/libs/database/schema';
import { redemptionConfigEntityFactory } from '@blc-mono/redemptions/libs/test/factories/redemptionConfigEntity.factory';
import { vaultBatchEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultBatchEntity.factory';
import { vaultCodeEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultCodeEntity.factory';
import { vaultEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultEntity.factory';

export async function createRedemptionRecord(
  connection: DatabaseConnection,
): Promise<typeof redemptionsTable.$inferSelect> {
  const redemption = redemptionConfigEntityFactory.build();
  await connection.db.insert(redemptionsTable).values(redemption).execute();
  return redemption;
}

export async function createVaultRecord(
  connection: DatabaseConnection,
  redemptionId: string,
): Promise<typeof vaultsTable.$inferSelect> {
  const vault = vaultEntityFactory.build({ redemptionId: redemptionId });
  await connection.db.insert(vaultsTable).values(vault).execute();
  return vault;
}

export async function createVaultBatchRecord(
  connection: DatabaseConnection,
  vaultId: string,
  batchId?: string,
): Promise<typeof vaultBatchesTable.$inferSelect> {
  let vaultBatch;
  if (batchId) {
    vaultBatch = vaultBatchEntityFactory.build({
      id: batchId,
      vaultId: vaultId,
    });
  } else {
    vaultBatch = vaultBatchEntityFactory.build({
      vaultId: vaultId,
    });
  }

  await connection.db.insert(vaultBatchesTable).values(vaultBatch).execute();
  return vaultBatch;
}

export async function createManyVaultBatchRecords(
  connection: DatabaseConnection,
  vaultId: string,
  count: number,
): Promise<(typeof vaultBatchesTable.$inferSelect)[]> {
  const vaultBatches = vaultBatchEntityFactory.buildList(count, {
    vaultId: vaultId,
  });
  await connection.db.insert(vaultBatchesTable).values(vaultBatches).execute();
  return vaultBatches;
}

export async function createVaultCodeRecordsUnclaimed(
  connection: DatabaseConnection,
  vaultId: string,
  batchId: string,
  batchSize: number,
): Promise<VaultCodeEntity[]> {
  const vaultCodes = vaultCodeEntityFactory.buildList(batchSize, {
    vaultId: vaultId,
    batchId: batchId,
    memberId: null,
  });
  await connection.db.insert(vaultCodesTable).values(vaultCodes).execute();
  return vaultCodes;
}

export async function createVaultCodeRecordsClaimed(
  connection: DatabaseConnection,
  vaultId: string,
  batchId: string,
  batchSize: number,
): Promise<VaultCodeEntity[]> {
  const vaultCodes = vaultCodeEntityFactory.buildList(batchSize, {
    vaultId: vaultId,
    batchId: batchId,
  });
  await connection.db.insert(vaultCodesTable).values(vaultCodes).execute();
  return vaultCodes;
}

export async function createVaultCodeRecordsExpired(
  connection: DatabaseConnection,
  vaultId: string,
  batchId: string,
  batchSize: number,
): Promise<VaultCodeEntity[]> {
  const expiry = faker.date.past();
  expiry.setMilliseconds(0);

  const vaultCodes = vaultCodeEntityFactory.buildList(batchSize, {
    vaultId: vaultId,
    batchId: batchId,
    expiry: new Date(expiry),
    memberId: null,
  });
  await connection.db.insert(vaultCodesTable).values(vaultCodes).execute();
  return vaultCodes;
}
