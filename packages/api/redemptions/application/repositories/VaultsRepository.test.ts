import { faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm';

import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { redemptionsTable, vaultsTable } from '@blc-mono/redemptions/libs/database/schema';

import { redemptionConfigEntityFactory } from '../../libs/test/factories/redemptionConfigEntity.factory';
import { newVaultEntityFactory, vaultEntityFactory } from '../../libs/test/factories/vaultEntity.factory';
import { RedemptionsTestDatabase } from '../../libs/test/helpers/database';

import { RedemptionConfigEntity } from './RedemptionConfigRepository';
import { NewVaultEntity, VaultEntity, VaultsRepository } from './VaultsRepository';

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
      const redemption = redemptionConfigEntityFactory.build();
      const vault = vaultEntityFactory.build({
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
      const redemption = redemptionConfigEntityFactory.build();
      await connection.db.insert(redemptionsTable).values(redemption).execute();

      // Act
      const result = await repository.findOneByRedemptionId(redemption.id);

      // Assert
      expect(result).toEqual(null);
    });

    it('should throw an error when there are multiple matching vaults matching the redemptionId', async () => {
      // Arrange
      const repository = new VaultsRepository(connection);
      const redemption = redemptionConfigEntityFactory.build();
      const vault1 = vaultEntityFactory.build({
        redemptionId: redemption.id,
        status: 'active',
        maxPerUser: 1,
      });
      const vault2 = vaultEntityFactory.build({
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

  describe('deleteById', () => {
    it('should delete vault', async () => {
      // Arrange
      const repository = new VaultsRepository(connection);
      const redemptionEntity = redemptionConfigEntityFactory.build();
      const vaultEntity = vaultEntityFactory.build({
        redemptionId: redemptionEntity.id,
        status: 'active',
        maxPerUser: 1,
      });
      await connection.db.insert(redemptionsTable).values(redemptionEntity).execute();
      await connection.db.insert(vaultsTable).values(vaultEntity).execute();

      expect(await repository.findOneById(vaultEntity.id)).toEqual(vaultEntity);

      // Act
      const result = await repository.deleteById(vaultEntity.id);

      // Assert
      expect(result).toEqual([{ id: vaultEntity.id }]);
      expect(await repository.findOneById(vaultEntity.id)).toEqual(null);
    });

    it('should handle vault not found', async () => {
      // Arrange
      const repository = new VaultsRepository(connection);

      // Act
      const result = await repository.deleteById('not an id');

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('findOneById', () => {
    it('returns a vault when given a valid vaultId', async () => {
      // Arrange
      const repository = new VaultsRepository(connection);
      const redemption = redemptionConfigEntityFactory.build();
      const vault = vaultEntityFactory.build({ redemptionId: redemption.id });
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
      const redemption = redemptionConfigEntityFactory.build();
      const vault = vaultEntityFactory.build({
        redemptionId: redemption.id,
        status: 'active',
        maxPerUser: 1,
      });
      await connection.db.insert(redemptionsTable).values(redemption).execute();
      await connection.db.insert(vaultsTable).values(vault).execute();
      const vaultDataToUpdate: Pick<VaultEntity, 'status'> = {
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
      const vaultDataToUpdate: Pick<VaultEntity, 'status'> = {
        status: 'in-active',
      };

      // Act
      const result = await repository.updateOneById(id, vaultDataToUpdate);

      // Assert
      expect(result).toEqual(undefined);
    });
  });

  describe('createVault', () => {
    it('creates a vault and sets the created datetime', async () => {
      // Arrange
      const repository = new VaultsRepository(connection);
      const redemption: RedemptionConfigEntity = redemptionConfigEntityFactory.build();
      const vault: NewVaultEntity = newVaultEntityFactory.build({
        redemptionId: redemption.id,
        status: 'active',
        maxPerUser: 1,
      });
      await connection.db.insert(redemptionsTable).values(redemption).execute();

      // Act
      const result = await repository.create(vault);

      // Assert
      const createdVault = await connection.db
        .select()
        .from(vaultsTable)
        .where(eq(vaultsTable.redemptionId, redemption.id))
        .execute();

      expect(result).toEqual(createdVault[0]);
    });

    it('creates many vaults and sets the same created datetime for each vault', async () => {
      // Arrange
      const repository = new VaultsRepository(connection);
      const redemption: RedemptionConfigEntity = redemptionConfigEntityFactory.build();
      const vault: NewVaultEntity[] = newVaultEntityFactory.buildList(2, {
        redemptionId: redemption.id,
        status: 'active',
        maxPerUser: 1,
      });
      await connection.db.insert(redemptionsTable).values(redemption).execute();

      // Act
      const result = await repository.createMany(vault);

      // Assert
      const createdVaults = await connection.db
        .select()
        .from(vaultsTable)
        .where(eq(vaultsTable.redemptionId, redemption.id))
        .execute();

      expect(result).toEqual(createdVaults);
      expect(result[0].created).toStrictEqual(result[1].created);
    });
  });
});
