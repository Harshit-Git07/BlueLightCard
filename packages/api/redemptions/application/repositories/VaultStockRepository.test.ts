import { RedemptionTypes, VAULT } from '@blc-mono/core/constants/redemptions';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { RedemptionsTestDatabase } from '@blc-mono/redemptions/libs/test/helpers/database';
import {
  createRedemptionRecord,
  createVaultBatchRecord,
  createVaultCodeRecordsClaimed,
  createVaultCodeRecordsUnclaimed,
  createVaultRecord,
} from '@blc-mono/redemptions/libs/test/helpers/databaseRecords';

import { RedemptionConfigEntity } from './RedemptionConfigRepository';
import { VaultBatchEntity } from './VaultBatchesRepository';
import { VaultEntity } from './VaultsRepository';
import { VaultBatchStockRecord, VaultStockRecord, VaultStockRepository } from './VaultStockRepository';

type TestDataEntities = {
  redemption: RedemptionConfigEntity;
  vault: VaultEntity;
  vaultBatch: VaultBatchEntity;
};

describe('VaultStockRepository', () => {
  let database: RedemptionsTestDatabase;
  let connection: DatabaseConnection;

  beforeAll(async () => {
    database = await RedemptionsTestDatabase.start();
    connection = await database.getConnection();
  }, 60_000);

  afterEach(async () => {
    await database?.reset();
  });

  afterAll(async () => {
    await database?.down();
  });

  async function createTestData(claimedBatchSize?: number, unclaimedBatchSize?: number): Promise<TestDataEntities> {
    const redemption: RedemptionConfigEntity = await createRedemptionRecord(connection, VAULT as RedemptionTypes);
    const vault: VaultEntity = await createVaultRecord(connection, redemption.id);
    const vaultBatch: VaultBatchEntity = await createVaultBatchRecord(connection, vault.id);
    if (claimedBatchSize) {
      await createVaultCodeRecordsClaimed(connection, vault.id, vaultBatch.id, claimedBatchSize);
    }
    if (unclaimedBatchSize) {
      await createVaultCodeRecordsUnclaimed(connection, vault.id, vaultBatch.id, unclaimedBatchSize);
    }

    return {
      redemption: redemption,
      vault: vault,
      vaultBatch: vaultBatch,
    };
  }

  describe('findAllVaults', () => {
    it('should return empty array when no vault data', async () => {
      const repository = new VaultStockRepository(connection);
      const actual = await repository.findAllVaults();
      expect(actual).toEqual([]);
    });

    it('should return vault data', async () => {
      const { redemption, vault } = await createTestData();
      const expected = [
        {
          companyId: redemption.companyId,
          offerId: redemption.offerId,
          vaultId: vault.id,
          email: vault.email,
          status: vault.status,
          integration: vault.integration,
        },
      ] satisfies VaultStockRecord[];

      const repository = new VaultStockRepository(connection);
      const actual = await repository.findAllVaults();
      expect(actual).toEqual(expected);
    });
  });

  describe('countUnclaimedCodesForVault', () => {
    it('should return 0 when no vault codes', async () => {
      const { vault } = await createTestData();
      const repository = new VaultStockRepository(connection);
      const actual = await repository.countUnclaimedCodesForVault(vault.id);
      expect(actual).toEqual(0);
    });

    it('should return count of unclaimed codes', async () => {
      const claimedBatchSize = 10;
      const unclaimedBatchSize = 12;
      const { vault } = await createTestData(claimedBatchSize, unclaimedBatchSize);
      const repository = new VaultStockRepository(connection);
      const actual = await repository.countUnclaimedCodesForVault(vault.id);
      expect(actual).toEqual(unclaimedBatchSize);
    });
  });

  describe('findBatchesForVault', () => {
    it('should return empty array when no vault batch data for vault id passed', async () => {
      await createTestData();
      const repository = new VaultStockRepository(connection);
      const actual = await repository.findBatchesForVault('any-old-vault-id-with-no-batch');
      expect(actual).toEqual([]);
    });

    it('should return vault batch data for vault id that exists', async () => {
      const claimedBatchSize = 10;
      const unclaimedBatchSize = 12;
      const { vault, vaultBatch } = await createTestData(claimedBatchSize, unclaimedBatchSize);
      const expected = [
        {
          batchId: vaultBatch.id,
          expiry: vaultBatch.expiry,
          unclaimed: unclaimedBatchSize,
        },
      ] satisfies VaultBatchStockRecord[];

      const repository = new VaultStockRepository(connection);
      const actual = await repository.findBatchesForVault(vault.id);
      expect(actual).toEqual(expected);
    });
  });
});
