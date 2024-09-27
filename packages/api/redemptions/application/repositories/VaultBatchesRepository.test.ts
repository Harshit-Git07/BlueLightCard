import { eq } from 'drizzle-orm';

import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { vaultBatchesTable } from '@blc-mono/redemptions/libs/database/schema';
import {
  createManyVaultBatchRecords,
  createRedemptionRecord,
  createVaultBatchRecord,
  createVaultCodeRecordsClaimed,
  createVaultCodeRecordsUnclaimed,
  createVaultRecord,
} from '@blc-mono/redemptions/libs/test/helpers/databaseRecords';

import { vaultBatchEntityFactory } from '../../libs/test/factories/vaultBatchEntity.factory';
import { RedemptionsTestDatabase } from '../../libs/test/helpers/database';

import { VaultBatchesRepository } from './VaultBatchesRepository';

describe('VaultBatchesRepository', () => {
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

  describe('createVaultBatch', () => {
    it('should create the vaultBatch', async () => {
      const redemption = await createRedemptionRecord(connection);
      const vault = await createVaultRecord(connection, redemption.id);
      const vaultBatchEntity = vaultBatchEntityFactory.build({
        vaultId: vault.id,
      });
      const repository = new VaultBatchesRepository(connection);
      const result = await repository.create(vaultBatchEntity);
      expect(result).toEqual({ id: vaultBatchEntity.id });
      const createdVaultBatch = await connection.db
        .select()
        .from(vaultBatchesTable)
        .where(eq(vaultBatchesTable.id, vaultBatchEntity.id))
        .execute();
      expect(createdVaultBatch[0]).toEqual(vaultBatchEntity);
    });
  });

  describe('updateOneById', () => {
    it('should update file and expiry of the vaultBatch ', async () => {
      // Arrange
      const updatedData = {
        file: 'new-file',
        expiry: new Date('2025-08-02T16:20:52.000Z'),
      };
      const redemption = await createRedemptionRecord(connection);
      const vault = await createVaultRecord(connection, redemption.id);
      const vaultBatch = await createVaultBatchRecord(connection, vault.id);
      const repository = new VaultBatchesRepository(connection);

      // Act
      const result = await repository.updateOneById(vaultBatch.id, updatedData);
      const updatedVaultBatch = await connection.db
        .select()
        .from(vaultBatchesTable)
        .where(eq(vaultBatchesTable.id, vaultBatch.id))
        .execute();

      // Assert
      expect(result).toEqual({ id: vaultBatch.id });
      expect(updatedVaultBatch[0]).toEqual({
        id: vaultBatch.id,
        vaultId: vault.id,
        created: vaultBatch.created,
        ...updatedData,
      });
    });

    it('should return null if the vaultBatch does not exist', async () => {
      // Arrange
      const updatedData = {
        file: 'new-file',
      };
      const repository = new VaultBatchesRepository(connection);

      // Act
      const result = await repository.updateOneById('non-existing-id', updatedData);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findOneById', () => {
    it('should find the vaultBatch by id', async () => {
      // Arrange
      const redemption = await createRedemptionRecord(connection);
      const vault = await createVaultRecord(connection, redemption.id);
      const vaultBatch = await createVaultBatchRecord(connection, vault.id);
      const repository = new VaultBatchesRepository(connection);

      // Act
      const result = await repository.findOneById(vaultBatch.id);

      // Assert
      expect(result).toEqual(vaultBatch);
    });

    it('should return null if the vaultBatch does not exist', async () => {
      // Arrange
      const repository = new VaultBatchesRepository(connection);

      // Act
      const result = await repository.findOneById('non-existent-batch-id');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findByVaultId', () => {
    it('returns all batches with the given vault identifier', async () => {
      // Arrange
      const redemption = await createRedemptionRecord(connection);
      const vault = await createVaultRecord(connection, redemption.id);
      const batchCount = 3;
      await createManyVaultBatchRecords(connection, vault.id, batchCount);
      const repository = new VaultBatchesRepository(connection);

      // Act
      const result = await repository.findByVaultId(vault.id);

      // Assert
      expect(result).toHaveLength(batchCount);
    });

    it('does not return batches for other vaults', async () => {
      // Arrange
      const repository = new VaultBatchesRepository(connection);

      const redemption1 = await createRedemptionRecord(connection);
      const redemption2 = await createRedemptionRecord(connection);
      const lookupVault = await createVaultRecord(connection, redemption1.id);
      const otherVault = await createVaultRecord(connection, redemption2.id);
      await createManyVaultBatchRecords(connection, lookupVault.id, 2);
      await createManyVaultBatchRecords(connection, otherVault.id, 2);

      // Act
      const result = await repository.findByVaultId(lookupVault.id);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].vaultId).toBe(lookupVault.id);
      expect(result[1].vaultId).toBe(lookupVault.id);
    });

    it('returns an empty array if no batches are found', async () => {
      // Arrange
      const repository = new VaultBatchesRepository(connection);
      const redemption = await createRedemptionRecord(connection);
      const vault = await createVaultRecord(connection, redemption.id);

      // Act
      const result = await repository.findByVaultId(vault.id);

      // Assert
      expect(result).toStrictEqual([]);
    });
  });

  describe('getCodesRemaining', () => {
    it('returns the number of unused codes in a batch', async () => {
      // Arrange
      const repository = new VaultBatchesRepository(connection);

      const redemption = await createRedemptionRecord(connection);
      const vault = await createVaultRecord(connection, redemption.id);
      const vaultBatch = await createVaultBatchRecord(connection, vault.id);

      const unclaimedBatchSize = 5;
      await createVaultCodeRecordsUnclaimed(connection, vault.id, vaultBatch.id, unclaimedBatchSize);

      const claimedBatchSize = 2;
      await createVaultCodeRecordsClaimed(connection, vault.id, vaultBatch.id, claimedBatchSize);

      // Act
      const result = await repository.getCodesRemaining(vaultBatch.id);

      // Assert
      expect(result).toBe(unclaimedBatchSize);
    });

    it('does not include counts for other batches', async () => {
      // Arrange
      const repository = new VaultBatchesRepository(connection);

      const redemption = await createRedemptionRecord(connection);
      const vault = await createVaultRecord(connection, redemption.id);
      const lookupBatch = await createVaultBatchRecord(connection, vault.id);
      const otherBatch = await createVaultBatchRecord(connection, vault.id);

      const lookupBatchSize = 6;
      await createVaultCodeRecordsUnclaimed(connection, vault.id, lookupBatch.id, lookupBatchSize);

      const otherBatchSize = 3;
      await createVaultCodeRecordsUnclaimed(connection, vault.id, otherBatch.id, otherBatchSize);

      // Act
      const result = await repository.getCodesRemaining(lookupBatch.id);

      // Assert
      expect(result).toBe(lookupBatchSize);
    });

    it('does not include counts for other vaults', async () => {
      // Arrange
      const repository = new VaultBatchesRepository(connection);

      const redemption1 = await createRedemptionRecord(connection);
      const lookupVault = await createVaultRecord(connection, redemption1.id);
      const lookupBatch = await createVaultBatchRecord(connection, lookupVault.id);
      const lookupBatchSize = 3;
      await createVaultCodeRecordsUnclaimed(connection, lookupVault.id, lookupBatch.id, lookupBatchSize);

      const redemption2 = await createRedemptionRecord(connection);
      const otherVault = await createVaultRecord(connection, redemption2.id);
      const otherBatch = await createVaultBatchRecord(connection, otherVault.id);
      const otherBatchSize = 5;
      await createVaultCodeRecordsUnclaimed(connection, otherVault.id, otherBatch.id, otherBatchSize);

      // Act
      const result = await repository.getCodesRemaining(lookupBatch.id);

      // Assert
      expect(result).toBe(lookupBatchSize);
    });

    it('returns zero if no codes are found', async () => {
      // Arrange
      const repository = new VaultBatchesRepository(connection);

      const redemption = await createRedemptionRecord(connection);
      const vault = await createVaultRecord(connection, redemption.id);
      const vaultBatch = await createVaultBatchRecord(connection, vault.id);

      // Act
      const result = await repository.getCodesRemaining(vaultBatch.id);

      // Assert
      expect(result).toBe(0);
    });

    it('returns zero if the vault batch does not exist', async () => {
      // Arrange
      const repository = new VaultBatchesRepository(connection);

      // Act
      const result = await repository.getCodesRemaining('batch-does-not-exist');

      // Assert
      expect(result).toBe(0);
    });
  });

  describe('deleteById', () => {
    it('returns empty if the vault batch does not exist', async () => {
      // Arrange
      const repository = new VaultBatchesRepository(connection);

      // Act
      const result = await repository.deleteById('batch-does-not-exist');

      // Assert
      expect(result.length).toBe(0);
    });

    it('returns batch ID if the vault batch exists', async () => {
      // Arrange
      const repository = new VaultBatchesRepository(connection);

      const redemption = await createRedemptionRecord(connection);
      const vault = await createVaultRecord(connection, redemption.id);
      const vaultBatch = await createVaultBatchRecord(connection, vault.id);

      // Act
      const result = await repository.deleteById(vaultBatch.id);

      // Assert
      expect(result.length).toBe(1);
      expect(result).toStrictEqual([{ id: vaultBatch.id }]);
    });
  });
});
