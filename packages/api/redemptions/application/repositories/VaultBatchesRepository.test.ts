import { eq } from 'drizzle-orm';

import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import {
  redemptionsTable,
  vaultBatchesTable,
  vaultCodesTable,
  vaultsTable,
} from '@blc-mono/redemptions/libs/database/schema';
import { vaultCodeFactory } from '@blc-mono/redemptions/libs/test/factories/vaultCode.factory';

import { redemptionFactory } from '../../libs/test/factories/redemption.factory';
import { vaultFactory } from '../../libs/test/factories/vault.factory';
import { vaultBatchFactory } from '../../libs/test/factories/vaultBatches.factory';
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
      const redemption = redemptionFactory.build();
      await connection.db.insert(redemptionsTable).values(redemption).execute();

      const vault = vaultFactory.build({ redemptionId: redemption.id });
      await connection.db.insert(vaultsTable).values(vault).execute();

      const vaultBatch = vaultBatchFactory.build({
        vaultId: vault.id,
      });
      const repository = new VaultBatchesRepository(connection);
      const result = await repository.create(vaultBatch);
      expect(result).toEqual({ id: vaultBatch.id });
      const createdVaultBatch = await connection.db
        .select()
        .from(vaultBatchesTable)
        .where(eq(vaultBatchesTable.id, vaultBatch.id))
        .execute();
      expect(createdVaultBatch[0]).toEqual(vaultBatch);
    });
  });

  describe('updateOneById', () => {
    it('should update file and expiry of the vaultBatch ', async () => {
      // Arrange
      const updatedData = {
        file: 'new-file',
        expiry: new Date('2025-08-02T16:20:52.000Z'),
      };
      const redemption = redemptionFactory.build();
      const vault = vaultFactory.build({ redemptionId: redemption.id });
      const vaultBatch = vaultBatchFactory.build({
        vaultId: vault.id,
        file: 'old-file',
      });
      await connection.db.insert(redemptionsTable).values(redemption).execute();
      await connection.db.insert(vaultsTable).values(vault).execute();
      await connection.db.insert(vaultBatchesTable).values(vaultBatch).execute();
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
      const redemption = redemptionFactory.build();
      const vault = vaultFactory.build({ redemptionId: redemption.id });
      const vaultBatch = vaultBatchFactory.build({
        vaultId: vault.id,
        created: new Date('2024-01-03T00:27:26.000Z'),
        expiry: new Date('2025-01-26T19:07:53.000Z'),
      });
      await connection.db.insert(redemptionsTable).values(redemption).execute();
      await connection.db.insert(vaultsTable).values(vault).execute();
      await connection.db.insert(vaultBatchesTable).values(vaultBatch).execute();
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
      const repository = new VaultBatchesRepository(connection);
      const redemption = redemptionFactory.build();
      const vault = vaultFactory.build({ redemptionId: redemption.id });

      const vaultBatches = vaultBatchFactory.buildList(3, {
        vaultId: vault.id,
      });

      await connection.db.insert(redemptionsTable).values(redemption).execute();
      await connection.db.insert(vaultsTable).values(vault).execute();
      await connection.db.insert(vaultBatchesTable).values(vaultBatches).execute();

      // Act
      const result = await repository.findByVaultId(vault.id);

      // Assert
      expect(result).toHaveLength(3);
    });

    it('does not return batches for other vaults', async () => {
      // Arrange
      const repository = new VaultBatchesRepository(connection);

      const redemptions = redemptionFactory.buildList(2);
      const lookupVault = vaultFactory.build({ redemptionId: redemptions[0].id });
      const otherVault = vaultFactory.build({ redemptionId: redemptions[1].id });

      const vaultBatches = [
        ...vaultBatchFactory.buildList(2, {
          vaultId: lookupVault.id,
        }),
        ...vaultBatchFactory.buildList(2, {
          vaultId: otherVault.id,
        }),
      ];

      await connection.db.insert(redemptionsTable).values(redemptions).execute();
      await connection.db.insert(vaultsTable).values([lookupVault, otherVault]).execute();
      await connection.db.insert(vaultBatchesTable).values(vaultBatches).execute();

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
      const redemption = redemptionFactory.build();
      const vault = vaultFactory.build({ redemptionId: redemption.id });

      await connection.db.insert(redemptionsTable).values(redemption).execute();
      await connection.db.insert(vaultsTable).values(vault).execute();

      // Act
      const result = await repository.findByVaultId(vault.id);

      // Assert
      expect(result).toStrictEqual([]);
    });
  });

  describe('getCodesRemaining', () => {
    it('returns the number of unused codes in a batch', async () => {
      // Arrange
      const unusedMemberId = null;
      const usedMemberId = '12345';

      const repository = new VaultBatchesRepository(connection);
      const redemption = redemptionFactory.build();
      const vault = vaultFactory.build({ redemptionId: redemption.id });
      const vaultBatch = vaultBatchFactory.build({ vaultId: vault.id });
      const vaultCodes = [
        ...vaultCodeFactory.buildList(5, {
          vaultId: vault.id,
          batchId: vaultBatch.id,
          memberId: unusedMemberId,
        }),
        ...vaultCodeFactory.buildList(2, {
          vaultId: vault.id,
          batchId: vaultBatch.id,
          memberId: usedMemberId,
        }),
      ];

      await connection.db.insert(redemptionsTable).values(redemption).execute();
      await connection.db.insert(vaultsTable).values(vault).execute();
      await connection.db.insert(vaultBatchesTable).values(vaultBatch).execute();
      await connection.db.insert(vaultCodesTable).values(vaultCodes).execute();

      // Act
      const result = await repository.getCodesRemaining(vaultBatch.id);

      // Assert
      expect(result).toBe(5);
    });

    it('does not include counts for other batches', async () => {
      // Arrange
      const repository = new VaultBatchesRepository(connection);
      const redemption = redemptionFactory.build();
      const vault = vaultFactory.build({ redemptionId: redemption.id });
      const [lookupBatch, otherBatch] = vaultBatchFactory.buildList(2, { vaultId: vault.id });
      const lookupBatchVaultCodes = vaultCodeFactory.buildList(6, {
        vaultId: vault.id,
        batchId: lookupBatch.id,
        memberId: null,
      });
      const otherBatchVaultCodes = vaultCodeFactory.buildList(3, {
        vaultId: vault.id,
        batchId: otherBatch.id,
        memberId: null,
      });

      await connection.db.insert(redemptionsTable).values(redemption).execute();
      await connection.db.insert(vaultsTable).values(vault).execute();
      await connection.db.insert(vaultBatchesTable).values([lookupBatch, otherBatch]).execute();
      await connection.db.insert(vaultCodesTable).values(lookupBatchVaultCodes).execute();
      await connection.db.insert(vaultCodesTable).values(otherBatchVaultCodes).execute();

      // Act
      const result = await repository.getCodesRemaining(lookupBatch.id);

      // Assert
      expect(result).toBe(6);
    });

    it('does not include counts for other vaults', async () => {
      // Arrange
      const repository = new VaultBatchesRepository(connection);
      const redemptions = redemptionFactory.buildList(2);
      const lookupVault = vaultFactory.build({ redemptionId: redemptions[0].id });
      const otherVault = vaultFactory.build({ redemptionId: redemptions[1].id });
      const lookupBatch = vaultBatchFactory.build({ vaultId: lookupVault.id });
      const otherBatch = vaultBatchFactory.build({ vaultId: otherVault.id });

      const lookupBatchVaultCodes = vaultCodeFactory.buildList(3, {
        vaultId: lookupVault.id,
        batchId: lookupBatch.id,
        memberId: null,
      });
      const otherBatchVaultCodes = vaultCodeFactory.buildList(5, {
        vaultId: otherVault.id,
        batchId: otherBatch.id,
        memberId: null,
      });

      await connection.db.insert(redemptionsTable).values(redemptions).execute();
      await connection.db.insert(vaultsTable).values([lookupVault, otherVault]).execute();
      await connection.db.insert(vaultBatchesTable).values([lookupBatch, otherBatch]).execute();
      await connection.db.insert(vaultCodesTable).values(lookupBatchVaultCodes).execute();
      await connection.db.insert(vaultCodesTable).values(otherBatchVaultCodes).execute();

      // Act
      const result = await repository.getCodesRemaining(lookupBatch.id);

      // Assert
      expect(result).toBe(3);
    });

    it('returns zero if no codes are found', async () => {
      // Arrange
      const repository = new VaultBatchesRepository(connection);
      const redemption = redemptionFactory.build();
      const vault = vaultFactory.build({ redemptionId: redemption.id });
      const vaultBatch = vaultBatchFactory.build({ vaultId: vault.id });

      await connection.db.insert(redemptionsTable).values(redemption).execute();
      await connection.db.insert(vaultsTable).values(vault).execute();
      await connection.db.insert(vaultBatchesTable).values(vaultBatch).execute();

      // Act
      const result = await repository.getCodesRemaining(vaultBatch.id);

      // Assert
      expect(result).toBe(0);
    });

    it('returns zero if the vault batch does not exist', async () => {
      // Arrange
      const repository = new VaultBatchesRepository(connection);
      const redemption = redemptionFactory.build();
      const vault = vaultFactory.build({ redemptionId: redemption.id });

      await connection.db.insert(redemptionsTable).values(redemption).execute();
      await connection.db.insert(vaultsTable).values(vault).execute();

      // Act
      const result = await repository.getCodesRemaining('batch-does-not-exist');

      // Assert
      expect(result).toBe(0);
    });
  });
});
