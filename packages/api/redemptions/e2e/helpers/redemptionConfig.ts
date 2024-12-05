import { faker } from '@faker-js/faker';
import { eq, inArray } from 'drizzle-orm';

import { BallotEntity } from '@blc-mono/redemptions/application/repositories/BallotsRepository';
import { RedemptionConfigEntity } from '@blc-mono/redemptions/application/repositories/RedemptionConfigRepository';
import { VaultBatchEntity } from '@blc-mono/redemptions/application/repositories/VaultBatchesRepository';
import { VaultEntity } from '@blc-mono/redemptions/application/repositories/VaultsRepository';
import {
  ballotsTable,
  createBallotsIdE2E,
  createRedemptionsIdE2E,
  createVaultBatchesIdE2E,
  createVaultIdE2E,
  genericsTable,
  redemptionsTable,
  vaultBatchesTable,
  vaultCodesTable,
  vaultsTable,
} from '@blc-mono/redemptions/libs/database/schema';
import { ballotEntityFactory } from '@blc-mono/redemptions/libs/test/factories/ballotEntity.factory';
import { genericEntityFactory } from '@blc-mono/redemptions/libs/test/factories/genericEntity.factory';
import { redemptionConfigEntityFactory } from '@blc-mono/redemptions/libs/test/factories/redemptionConfigEntity.factory';
import { vaultBatchEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultBatchEntity.factory';
import { vaultCodeEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultCodeEntity.factory';
import { vaultEntityFactory } from '@blc-mono/redemptions/libs/test/factories/vaultEntity.factory';

import { E2EDatabaseConnectionManager } from './database';

type TestHook = {
  cleanup(): Promise<void>;
  insert(): Promise<void>;
};

type VaultBatchTestHook = TestHook & {
  vaultBatch: VaultBatchEntity;
};

type RedemptionConfigTestHookContext = {
  redemptionConfig?: RedemptionConfigEntity;
  vault?: VaultEntity;
  vaultBatch?: VaultBatchEntity;
  batches?: VaultBatchEntity[];
  ballot?: BallotEntity;
};

type RedemptionConfigParameters = Parameters<typeof redemptionConfigEntityFactory.build>[0];
type GenericParameters = Parameters<typeof genericEntityFactory.build>[0];
type VaultParameters = Parameters<typeof vaultEntityFactory.build>[0];
type VaultBatchParameters = Parameters<typeof vaultBatchEntityFactory.build>[0];
type BallotParameters = Parameters<typeof ballotEntityFactory.build>[0];

export const buildRedemptionConfig = (
  connectionManager: E2EDatabaseConnectionManager,
  redemptionParams: NonNullable<RedemptionConfigParameters> = {},
) => {
  let createdGeneric: TestHook;
  let createdVault: TestHook;
  let createdBallot: TestHook;

  const redemptionType = redemptionParams.redemptionType ?? faker.helpers.arrayElement(['vault', 'vaultQR']);
  const redemptionConfig = redemptionConfigEntityFactory.build({
    id: createRedemptionsIdE2E(),
    redemptionType: redemptionType,
    connection: 'direct',
    ...redemptionParams,
  });

  const hooks = {
    redemptionConfig,
    async insert() {
      await connectionManager.connection.db.insert(redemptionsTable).values(redemptionConfig);
      await createdGeneric?.insert();
      await createdVault?.insert();
      await createdBallot?.insert();
    },
    async cleanup() {
      await createdGeneric?.cleanup();
      await createdVault?.cleanup();
      await createdBallot?.cleanup();
      await connectionManager.connection.db
        .delete(redemptionsTable)
        .where(eq(redemptionsTable.id, redemptionConfig.id));
    },
    addGeneric(params: Parameters<typeof buildGeneric>[1] = {}) {
      const genericData = buildGeneric(connectionManager, { ...params, redemptionId: redemptionConfig.id });
      createdGeneric = genericData;
      return { ...genericData, ...hooks };
    },
    addVault(params: Parameters<typeof buildVault>[1] = {}) {
      const vaultData = buildVault(connectionManager, { ...params, redemptionId: redemptionConfig.id }, hooks);
      createdVault = vaultData;
      return { ...vaultData, ...hooks };
    },
    addBallot(params: Parameters<typeof buildBallot>[1] = {}) {
      const ballotData = buildBallot(connectionManager, { ...params, redemptionId: redemptionConfig.id });
      createdBallot = ballotData;
      return { ...ballotData, ...hooks };
    },
  };

  return hooks;
};

export const buildGeneric = (
  connectionManager: E2EDatabaseConnectionManager,
  genericParams: NonNullable<GenericParameters>,
) => {
  const generic = genericEntityFactory.build(genericParams);

  return {
    generic,
    async insert() {
      await connectionManager.connection.db
        .insert(genericsTable)
        .values(generic)
        .returning({ id: genericsTable.id })
        .execute();
    },
    async cleanup() {
      await connectionManager.connection.db.delete(genericsTable).where(eq(genericsTable.id, generic.id));
    },
  };
};

export const buildVault = (
  connectionManager: E2EDatabaseConnectionManager,
  vaultParams: NonNullable<VaultParameters>,
  context: RedemptionConfigTestHookContext = {},
) => {
  const createdBatches: VaultBatchTestHook[] = [];
  const vault = vaultEntityFactory.build({
    ...vaultParams,
    id: createVaultIdE2E(),
    redemptionId: vaultParams.redemptionId,
  });

  const hooks = {
    get batches() {
      return createdBatches.map((hook) => hook.vaultBatch);
    },
    vault,
    async insert() {
      await connectionManager.connection.db.insert(vaultsTable).values(vault);
      await Promise.all(createdBatches.map((batch) => batch.insert()));
    },
    async cleanup() {
      await Promise.all(createdBatches.map((batch) => batch.cleanup()));
      await connectionManager.connection.db.delete(vaultBatchesTable).where(eq(vaultBatchesTable.vaultId, vault.id));
      await connectionManager.connection.db.delete(vaultsTable).where(eq(vaultsTable.id, vault.id));
    },
    addBatch(params: Parameters<typeof vaultBatchEntityFactory.build>[0] = {}) {
      const vaultBatchData = buildVaultBatch(
        connectionManager,
        { vaultId: vault.id, ...params },
        { ...hooks, ...context },
      );
      createdBatches.push(vaultBatchData);
      return { ...vaultBatchData, ...hooks, ...context };
    },
  };

  return hooks;
};

export const buildVaultBatch = (
  connectionManager: E2EDatabaseConnectionManager,
  params: NonNullable<VaultBatchParameters>,
  context: RedemptionConfigTestHookContext = {},
) => {
  const vaultCodeCollections: TestHook[] = [];
  const vaultBatch = vaultBatchEntityFactory.build({
    id: createVaultBatchesIdE2E(),
    ...params,
  });

  const hooks = {
    vaultBatch,
    async insert() {
      await connectionManager.connection.db.insert(vaultBatchesTable).values(vaultBatch);
      await Promise.all(vaultCodeCollections.map((codes) => codes.insert()));
    },
    async cleanup() {
      await Promise.all(vaultCodeCollections.map((codes) => codes.cleanup()));
      await connectionManager.connection.db.delete(vaultCodesTable).where(eq(vaultCodesTable.batchId, vaultBatch.id));
      await connectionManager.connection.db.delete(vaultBatchesTable).where(eq(vaultBatchesTable.id, vaultBatch.id));
    },
    addCodes(count: number, params: Parameters<typeof vaultCodeEntityFactory.build>[0] = {}) {
      const vaultCodes = buildVaultCodes(connectionManager, count, {
        vaultId: context.vault?.id,
        batchId: vaultBatch?.id,
        ...params,
      });
      vaultCodeCollections.push(vaultCodes);
      return { ...vaultCodes, ...hooks, ...context };
    },
  };

  return hooks;
};

export const buildVaultCodes = (
  connectionManager: E2EDatabaseConnectionManager,
  numberOfCodes: number,
  vaultCodeParams: NonNullable<Parameters<typeof vaultCodeEntityFactory.build>[0]> = {},
) => {
  const vaultCodes = vaultCodeEntityFactory.buildList(numberOfCodes, {
    vaultId: vaultCodeParams.vaultId,
    batchId: vaultCodeParams.batchId,
    memberId: null,
    ...vaultCodeParams,
  });

  return {
    vaultCodes,
    async insert() {
      await connectionManager.connection.db
        .insert(vaultCodesTable)
        .values(vaultCodes)
        .returning({ id: vaultCodesTable.id })
        .execute();
    },
    async cleanup() {
      await connectionManager.connection.db.delete(vaultCodesTable).where(
        inArray(
          vaultCodesTable.id,
          vaultCodes.map((code) => code.id),
        ),
      );
    },
  };
};

export const buildBallot = (
  connectionManager: E2EDatabaseConnectionManager,
  ballotParams: NonNullable<BallotParameters>,
) => {
  const ballot = ballotEntityFactory.build({
    ...ballotParams,
    id: createBallotsIdE2E(),
    redemptionId: ballotParams.redemptionId,
  });

  const hooks = {
    ballot,
    async insert() {
      await connectionManager.connection.db.insert(ballotsTable).values(ballot);
    },
    async cleanup() {
      await connectionManager.connection.db.delete(ballotsTable).where(eq(ballotsTable.id, ballot.id));
    },
  };

  return hooks;
};
