import { faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm';

import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { redemptionsTable, vaultsTable } from '@blc-mono/redemptions/libs/database/schema';

import { redemptionFactory } from '../../libs/test/factories/redemption.factory';
import { vaultFactory } from '../../libs/test/factories/vault.factory';
import { RedemptionsTestDatabase } from '../../libs/test/helpers/database';

import { Vault, VaultsRepository } from './VaultsRepository';

describe('VaultsRepository', () => {
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

  describe('findOneByRedemptionId', () => {
    it('should return the vault when it exists', async () => {
      // Arrange
      const repository = new VaultsRepository(connection);
      const redemption = redemptionFactory.build();
      const vault = vaultFactory.build({
        redemptionId: redemption.id,
        status: 'active',
        maxPerUser: 1,
      });
      await connection.db.insert(redemptionsTable).values(redemption).execute();
      await connection.db.insert(vaultsTable).values(vault).execute();

      // Act
      const result = await repository.findOneByRedemptionId(redemption.id);

      // Assert
      expect(result).toEqual(vault);
    });

    it('should return null when the vault does not exist', async () => {
      // Arrange
      const repository = new VaultsRepository(connection);
      const redemption = redemptionFactory.build();
      await connection.db.insert(redemptionsTable).values(redemption).execute();

      // Act
      const result = await repository.findOneByRedemptionId(redemption.id);

      // Assert
      expect(result).toEqual(null);
    });

    it('should throw an error when there are multiple matching vaults matching the redemptionId', async () => {
      // Arrange
      const repository = new VaultsRepository(connection);
      const redemption = redemptionFactory.build();
      const vault1 = vaultFactory.build({
        redemptionId: redemption.id,
        status: 'active',
        maxPerUser: 1,
      });
      const vault2 = vaultFactory.build({
        redemptionId: redemption.id,
        status: 'active',
        maxPerUser: 1,
      });
      await connection.db.insert(redemptionsTable).values(redemption).execute();
      await connection.db.insert(vaultsTable).values([vault1, vault2]).execute();

      // Act & Assert
      await expect(() => repository.findOneByRedemptionId(redemption.id)).rejects.toThrow();
    });
  });

  describe('findOneById', () => {
    it('returns a vault when given a valid vaultId', async () => {
      // Arrange
      const repository = new VaultsRepository(connection);
      const redemption = redemptionFactory.build();
      const vault = vaultFactory.build({ redemptionId: redemption.id });
      await connection.db.insert(redemptionsTable).values(redemption).execute();
      await connection.db.insert(vaultsTable).values(vault).execute();

      // Act
      const result = await repository.findOneById(vault.id);

      // Assert
      expect(result).toEqual(vault);
    });

    it('returns null when given a vaultId that does not exist', async () => {
      // Arrange
      const repository = new VaultsRepository(connection);
      // Act
      const result = await repository.findOneById('no-exist-vault-id');
      // Assert
      expect(result).toEqual(null);
    });
  });

  describe('updateOneById', () => {
    it('should update the vault when it exists', async () => {
      // Arrange
      const repository = new VaultsRepository(connection);
      const redemption = redemptionFactory.build();
      const vault = vaultFactory.build({
        redemptionId: redemption.id,
        status: 'active',
        maxPerUser: 1,
      });
      await connection.db.insert(redemptionsTable).values(redemption).execute();
      await connection.db.insert(vaultsTable).values(vault).execute();
      const vaultDataToUpdate: Pick<Vault, 'status'> = {
        status: 'in-active',
      };

      // Act
      const result = await repository.updateOneById(vault.id, vaultDataToUpdate);

      // Assert
      expect(result).toEqual({ id: vault.id });
      const updatedVault = await connection.db.select().from(vaultsTable).where(eq(vaultsTable.id, vault.id)).execute();
      expect(updatedVault[0].status).toEqual(vaultDataToUpdate.status);
    });

    it('should return undefined when the vault does not exist', async () => {
      // Arrange
      const repository = new VaultsRepository(connection);
      const id = faker.string.uuid();
      const vaultDataToUpdate: Pick<Vault, 'status'> = {
        status: 'in-active',
      };

      // Act
      const result = await repository.updateOneById(id, vaultDataToUpdate);

      // Assert
      expect(result).toEqual(undefined);
    });
  });

  describe('createVault', () => {
    it('should create the vault', async () => {
      // Arrange
      const repository = new VaultsRepository(connection);
      const redemption = redemptionFactory.build();
      const vault = vaultFactory.build({
        redemptionId: redemption.id,
        status: 'active',
        maxPerUser: 1,
      });
      await connection.db.insert(redemptionsTable).values(redemption).execute();

      // Act
      const result = await repository.create(vault);

      // Assert
      expect(result).toEqual({ id: vault.id });
      const createdVaults = await connection.db
        .select()
        .from(vaultsTable)
        .where(eq(vaultsTable.redemptionId, redemption.id))
        .execute();
      expect(createdVaults[0]).toEqual(vault);
    });
  });
});
