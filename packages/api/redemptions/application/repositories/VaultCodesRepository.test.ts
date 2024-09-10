import { eq } from 'drizzle-orm';

import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { vaultCodesTable } from '@blc-mono/redemptions/libs/database/schema';
import { vaultCodeFactory } from '@blc-mono/redemptions/libs/test/factories/vaultCode.factory';
import { RedemptionsTestDatabase } from '@blc-mono/redemptions/libs/test/helpers/database';
import {
  createRedemptionRecord,
  createVaultBatchRecord,
  createVaultCodeRecordsClaimed,
  createVaultCodeRecordsExpired,
  createVaultCodeRecordsUnclaimed,
  createVaultRecord,
} from '@blc-mono/redemptions/libs/test/helpers/databaseRecords';

import { VaultCodesRepository } from './VaultCodesRepository';

describe('VaultCodesRepository', () => {
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

  describe('checkIfMemberReachedMaxCodeClaimed', () => {
    it('should return true if the member has reached the max number of codes claimed', async () => {
      // TODO: Implement test
    });

    it('should return false if the member has not reached the max number of codes claimed', async () => {
      // TODO: Implement test
    });
  });

  describe('claimVaultCode', () => {
    it('should return a code if a code was successfully claimed', async () => {
      // TODO: Implement test
    });

    it('should return undefined if no codes were successfully claimed', async () => {
      // TODO: Implement test
    });
  });

  describe('checkVaultCodesRemaining', () => {
    it('should return the number of unclaimed codes in the vault', async () => {
      const redemption = await createRedemptionRecord(connection);
      const vault = await createVaultRecord(connection, redemption.id);
      const vaultBatch = await createVaultBatchRecord(connection, vault.id);

      const batchSize = 1000;
      await createVaultCodeRecordsUnclaimed(connection, vault.id, vaultBatch.id, batchSize);

      // Act
      const repository = new VaultCodesRepository(connection);
      const result = await repository.checkVaultCodesRemaining(vault.id);

      // Assert
      expect(result).toEqual(batchSize);
    });

    it('should return 0 if theres only expired unclaimed codes in the vault', async () => {
      // Arrange
      const redemption = await createRedemptionRecord(connection);
      const vault = await createVaultRecord(connection, redemption.id);
      const vaultBatch = await createVaultBatchRecord(connection, vault.id);

      const batchSize = 1000;
      await createVaultCodeRecordsExpired(connection, vault.id, vaultBatch.id, batchSize);

      // Act
      const repository = new VaultCodesRepository(connection);
      const result = await repository.checkVaultCodesRemaining(vault.id);

      // Assert
      expect(result).toEqual(0);
    });

    it('should throw error if vault codes does not exist with given vault ID', async () => {
      // Act & Assert
      const repository = new VaultCodesRepository(connection);
      await expect(() => repository.checkVaultCodesRemaining('some-vault-id-that-does-not-exist')).rejects.toThrow();
    });
  });

  describe('createVaultCode', () => {
    it('should create the vaultCode', async () => {
      // Arrange
      const redemption = await createRedemptionRecord(connection);
      const vault = await createVaultRecord(connection, redemption.id);
      const vaultBatch = await createVaultBatchRecord(connection, vault.id);

      const vaultCode = vaultCodeFactory.build({
        vaultId: vault.id,
        batchId: vaultBatch.id,
      });
      const repository = new VaultCodesRepository(connection);
      const result = await repository.create(vaultCode);

      expect(result).toEqual({ id: vaultCode.id });
      const createdVaultCode = await connection.db
        .select()
        .from(vaultCodesTable)
        .where(eq(vaultCodesTable.id, vaultCode.id))
        .execute();
      expect(createdVaultCode[0]).toEqual(vaultCode);
    });
  });

  describe('createManyVaultCode', () => {
    it('should create many vaultCodes', async () => {
      // Arrange
      const redemption = await createRedemptionRecord(connection);
      const vault = await createVaultRecord(connection, redemption.id);
      const vaultBatch = await createVaultBatchRecord(connection, vault.id);

      const batchSize = 1000;
      const vaultCodes = vaultCodeFactory.buildList(batchSize, {
        vaultId: vault.id,
        batchId: vaultBatch.id,
        memberId: null,
      });

      const repository = new VaultCodesRepository(connection);
      await repository.createMany(vaultCodes);
      const createdVaultCodes = await connection.db
        .select()
        .from(vaultCodesTable)
        .where(eq(vaultCodesTable.batchId, vaultBatch.id))
        .execute();
      expect(createdVaultCodes).toEqual(vaultCodes);
    });
  });

  describe('deleteAllUnusedCodesByBatchId', () => {
    it('should return array of vault code ids when delete all unclaimed codes associated to the batchId', async () => {
      // Arrange
      const redemption = await createRedemptionRecord(connection);
      const vault = await createVaultRecord(connection, redemption.id);
      const vaultBatch = await createVaultBatchRecord(connection, vault.id);

      const unclaimedBatchSize = 997;
      const unclaimedVaultCodes = await createVaultCodeRecordsUnclaimed(
        connection,
        vault.id,
        vaultBatch.id,
        unclaimedBatchSize,
      );

      const unclaimedVaultCodeIds = [];
      for (const vaultCode of unclaimedVaultCodes) {
        unclaimedVaultCodeIds.push({ id: vaultCode.id });
      }

      const claimedBatchSize = 3;
      const claimedVaultCodes = await createVaultCodeRecordsClaimed(
        connection,
        vault.id,
        vaultBatch.id,
        claimedBatchSize,
      );

      // Act
      const repository = new VaultCodesRepository(connection);
      const deletedVaultCodeIds = await repository.deleteUnclaimedCodesByBatchId(vaultBatch.id);

      // Assert
      expect(deletedVaultCodeIds).toEqual(unclaimedVaultCodeIds);

      const vaultCodesRemaining = await connection.db
        .select()
        .from(vaultCodesTable)
        .where(eq(vaultCodesTable.batchId, vaultBatch.id))
        .execute();

      expect(vaultCodesRemaining).toEqual(claimedVaultCodes);
    });

    it('should return empty array when attempt to delete all unused codes for a batchId that does not exist', async () => {
      const repository = new VaultCodesRepository(connection);
      const emptyArray = await repository.deleteUnclaimedCodesByBatchId('some-vault-batch-id-that-does-not-exist');
      expect(emptyArray).toEqual([]);
    });
  });

  describe('findClaimedCodesByBatchId', () => {
    it('should return array of claimed vault code associated to the batchId', async () => {
      // Arrange
      const redemption = await createRedemptionRecord(connection);
      const vault = await createVaultRecord(connection, redemption.id);
      const vaultBatch = await createVaultBatchRecord(connection, vault.id);

      const claimedBatchSize = 997;
      const claimedVaultCodes = await createVaultCodeRecordsClaimed(
        connection,
        vault.id,
        vaultBatch.id,
        claimedBatchSize,
      );

      const unclaimedBatchSize = 3;
      await createVaultCodeRecordsUnclaimed(connection, vault.id, vaultBatch.id, unclaimedBatchSize);

      const repository = new VaultCodesRepository(connection);
      const vaultCodesClaimed = await repository.findClaimedCodesByBatchId(vaultBatch.id);

      // Assert
      expect(vaultCodesClaimed).toEqual(claimedVaultCodes);
    });

    it('should return empty array when attempt to find claimed codes for a batchId that does not exist', async () => {
      const repository = new VaultCodesRepository(connection);
      const emptyArray = await repository.findClaimedCodesByBatchId('some-vault-batch-id-that-does-not-exist');
      expect(emptyArray).toEqual([]);
    });
  });

  describe('findUnClaimedCodesByBatchId', () => {
    it('should return array of unclaimed vault code associated to the batchId', async () => {
      // Arrange
      const redemption = await createRedemptionRecord(connection);
      const vault = await createVaultRecord(connection, redemption.id);
      const vaultBatch = await createVaultBatchRecord(connection, vault.id);

      const unclaimedBatchSize = 997;
      const unclaimedVaultCodes = await createVaultCodeRecordsUnclaimed(
        connection,
        vault.id,
        vaultBatch.id,
        unclaimedBatchSize,
      );

      const claimedBatchSize = 3;
      await createVaultCodeRecordsClaimed(connection, vault.id, vaultBatch.id, claimedBatchSize);

      const repository = new VaultCodesRepository(connection);
      const vaultCodesUnclaimed = await repository.findUnclaimedCodesByBatchId(vaultBatch.id);

      // Assert
      expect(vaultCodesUnclaimed).toEqual(unclaimedVaultCodes);
    });

    it('should return empty array when attempt to find unclaimed codes for a batchId that does not exist', async () => {
      const repository = new VaultCodesRepository(connection);
      const emptyArray = await repository.findUnclaimedCodesByBatchId('some-vault-batch-id-that-does-not-exist');
      expect(emptyArray).toEqual([]);
    });
  });

  describe('findManyByBatchId', () => {
    it('should find the vaultCodes by batchId', async () => {
      // Arrange
      const redemption = await createRedemptionRecord(connection);
      const vault = await createVaultRecord(connection, redemption.id);
      const vaultBatch = await createVaultBatchRecord(connection, vault.id);

      const claimedCodesBatchSize = 3;
      const vaultCodes = await createVaultCodeRecordsClaimed(
        connection,
        vault.id,
        vaultBatch.id,
        claimedCodesBatchSize,
      );

      // Act
      const repository = new VaultCodesRepository(connection);
      const result = await repository.findManyByBatchId(vaultBatch.id);

      // Assert
      expect(result).toEqual(vaultCodes);
    });

    it('should return an empty array if the vaultCodes dont exist', async () => {
      // Arrange
      const repository = new VaultCodesRepository(connection);

      // Act
      const result = await repository.findManyByBatchId('non-existing-id');

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('updateManyByBatchId', () => {
    it('should update vaultCodes', async () => {
      // Arrange
      const updatedData = {
        memberId: 'new-member-id',
        expiry: new Date('2025-08-02T16:20:52.000Z'),
        created: new Date('2024-08-02T16:20:52.000Z'),
      };
      const redemption = await createRedemptionRecord(connection);
      const vault = await createVaultRecord(connection, redemption.id);
      const vaultBatch = await createVaultBatchRecord(connection, vault.id);

      const unclaimedCodesBatchSize = 3;
      const vaultCodes = await createVaultCodeRecordsUnclaimed(
        connection,
        vault.id,
        vaultBatch.id,
        unclaimedCodesBatchSize,
      );

      // Act
      const repository = new VaultCodesRepository(connection);
      const result = await repository.updateManyByBatchId(vaultBatch.id, updatedData);

      // Assert
      expect(result).toEqual([{ id: vaultCodes[0].id }, { id: vaultCodes[1].id }, { id: vaultCodes[2].id }]);
    });

    it('should return an empty array if the vaultCodes dont exist', async () => {
      // Arrange
      const updatedData = {
        memberId: 'new-member-id',
        expiry: new Date('2025-08-02T16:20:52.000Z'),
        created: new Date('2024-08-02T16:20:52.000Z'),
      };
      const repository = new VaultCodesRepository(connection);

      // Act
      const result = await repository.updateManyByBatchId('non-existing-id', updatedData);

      // Assert
      expect(result).toEqual([]);
    });
  });
});
