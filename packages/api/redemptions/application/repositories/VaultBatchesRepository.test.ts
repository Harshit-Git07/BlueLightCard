import { eq } from 'drizzle-orm';

import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { redemptionsTable, vaultBatchesTable, vaultsTable } from '@blc-mono/redemptions/libs/database/schema';

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
});
