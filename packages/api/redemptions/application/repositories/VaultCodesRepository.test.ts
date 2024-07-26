import { eq } from 'drizzle-orm';

import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import {
  redemptionsTable,
  vaultBatchesTable,
  vaultCodesTable,
  vaultsTable,
} from '@blc-mono/redemptions/libs/database/schema';
import { redemptionFactory } from '@blc-mono/redemptions/libs/test/factories/redemption.factory';
import { vaultFactory } from '@blc-mono/redemptions/libs/test/factories/vault.factory';
import { vaultBatchFactory } from '@blc-mono/redemptions/libs/test/factories/vaultBatches.factory';
import { vaultCodeFactory } from '@blc-mono/redemptions/libs/test/factories/vaultCode.factory';
import { RedemptionsTestDatabase } from '@blc-mono/redemptions/libs/test/helpers/database';

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
      // Arrange
      const repository = new VaultCodesRepository(connection);
      const redemption = redemptionFactory.build();
      const vault = vaultFactory.build({
        redemptionId: redemption.id,
      });
      const vaultBatch = vaultBatchFactory.build({
        vaultId: vault.id,
      });
      const vaultCodes = [
        vaultCodeFactory.build({
          vaultId: vault.id,
          batchId: vaultBatch.id,
          memberId: null,
        }),
        vaultCodeFactory.build({
          vaultId: vault.id,
          batchId: vaultBatch.id,
          memberId: null,
        }),
      ];

      await connection.db.insert(redemptionsTable).values(redemption).execute();
      await connection.db.insert(vaultsTable).values(vault).execute();
      await connection.db.insert(vaultBatchesTable).values(vaultBatch).execute();
      await connection.db.insert(vaultCodesTable).values(vaultCodes).execute();

      // Act
      const result = await repository.checkVaultCodesRemaining(vault.id);

      // Assert
      expect(result).toEqual(2);
    });

    it('should return 0 if theres only expired unclaimed codes in the vault', async () => {
      // Arrange
      const repository = new VaultCodesRepository(connection);
      const redemption = redemptionFactory.build();
      const vault = vaultFactory.build({
        redemptionId: redemption.id,
      });
      const vaultBatch = vaultBatchFactory.build({
        vaultId: vault.id,
      });
      const vaultCodes = [
        vaultCodeFactory.build({
          vaultId: vault.id,
          batchId: vaultBatch.id,
          memberId: null,
          expiry: new Date('1999-01-01'),
        }),
        vaultCodeFactory.build({
          vaultId: vault.id,
          batchId: vaultBatch.id,
          memberId: null,
          expiry: new Date('1999-01-01'),
        }),
      ];

      await connection.db.insert(redemptionsTable).values(redemption).execute();
      await connection.db.insert(vaultsTable).values(vault).execute();
      await connection.db.insert(vaultBatchesTable).values(vaultBatch).execute();
      await connection.db.insert(vaultCodesTable).values(vaultCodes).execute();

      // Act
      const result = await repository.checkVaultCodesRemaining(vault.id);

      // Assert
      expect(result).toEqual(0);
    });

    it('should throw error if vault codes does not exist with given vault ID', async () => {
      // Arrange
      const repository = new VaultCodesRepository(connection);
      const redemption = redemptionFactory.build();
      const vault = vaultFactory.build({
        redemptionId: redemption.id,
      });

      await connection.db.insert(redemptionsTable).values(redemption).execute();

      // Act & Assert
      await expect(() => repository.checkVaultCodesRemaining(vault.id)).rejects.toThrow();
    });
  });

  describe('createVaultCode', () => {
    it('should create the vaultCode', async () => {
      const redemption = redemptionFactory.build();
      await connection.db.insert(redemptionsTable).values(redemption).execute();

      const vault = vaultFactory.build({ redemptionId: redemption.id });
      await connection.db.insert(vaultsTable).values(vault).execute();

      const vaultBatch = vaultBatchFactory.build({
        vaultId: vault.id,
      });
      await connection.db.insert(vaultBatchesTable).values(vaultBatch).execute();

      const vaultCode = vaultCodeFactory.build({
        vaultId: vault.id,
        batchId: vaultBatch.id,
        expiry: new Date('2028-12-31T23:59:59.000Z'),
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
      const redemption = redemptionFactory.build();
      await connection.db.insert(redemptionsTable).values(redemption).execute();

      const vault = vaultFactory.build({ redemptionId: redemption.id });
      await connection.db.insert(vaultsTable).values(vault).execute();

      const vaultBatch = vaultBatchFactory.build({
        vaultId: vault.id,
      });
      await connection.db.insert(vaultBatchesTable).values(vaultBatch).execute();

      const batchSize = 1000;
      const codeBatch = [];
      for (let i = 0; i < batchSize; i++) {
        const vaultCode = vaultCodeFactory.build({
          vaultId: vault.id,
          batchId: vaultBatch.id,
          expiry: new Date('2028-12-31T23:59:59.000Z'),
        });
        codeBatch.push(vaultCode);
      }

      const repository = new VaultCodesRepository(connection);
      await repository.createMany(codeBatch);
      const createdVaultCodes = await connection.db
        .select()
        .from(vaultCodesTable)
        .where(eq(vaultCodesTable.batchId, vaultBatch.id))
        .execute();
      expect(createdVaultCodes).toEqual(codeBatch);
    });
  });
});
