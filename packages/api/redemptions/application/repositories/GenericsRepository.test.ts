import { faker } from '@faker-js/faker';

import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { genericsTable, redemptionsTable } from '@blc-mono/redemptions/libs/database/schema';

import { genericEntityFactory } from '../../libs/test/factories/genericEntity.factory';
import { redemptionConfigEntityFactory } from '../../libs/test/factories/redemptionConfigEntity.factory';
import { RedemptionsTestDatabase } from '../../libs/test/helpers/database';

import { GenericsRepository, NewGenericEntity } from './GenericsRepository';

describe('GenericsRepository', () => {
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

  describe('createGeneric', () => {
    it('should create generic', async () => {
      // Arrange
      const repository = new GenericsRepository(connection);
      const redemptionEntity = redemptionConfigEntityFactory.build();
      const genericEntity: NewGenericEntity = {
        redemptionId: redemptionEntity.id,
        code: faker.string.alphanumeric(6),
      };

      await connection.db.insert(redemptionsTable).values(redemptionEntity).execute();

      // Act
      const result = await repository.createGeneric(genericEntity);

      // Assert
      expect(result.length).toEqual(1);
      const createdGenericEntity = await repository.findOneByRedemptionId(redemptionEntity.id);

      expect(createdGenericEntity).toEqual({
        id: result[0].id,
        redemptionId: redemptionEntity.id,
        code: genericEntity.code,
      });
    });
  });

  describe('updateByRedemptionId', () => {
    it('should update generic', async () => {
      // Arrange
      const repository = new GenericsRepository(connection);
      const redemptionEntity = redemptionConfigEntityFactory.build();
      const genericEntity = genericEntityFactory.build({
        redemptionId: redemptionEntity.id,
      });

      const updatedGenericEntity = genericEntityFactory.build({
        redemptionId: redemptionEntity.id,
      });

      await connection.db.insert(redemptionsTable).values(redemptionEntity).execute();
      await connection.db.insert(genericsTable).values(genericEntity).execute();

      // Act
      const result = await repository.updateByRedemptionId(redemptionEntity.id, updatedGenericEntity);

      // Assert
      expect(result.length).toEqual(1);
      const createdGenericEntity = await repository.findOneByRedemptionId(redemptionEntity.id);

      expect(createdGenericEntity).toEqual({
        id: result[0].id,
        redemptionId: redemptionEntity.id,
        code: updatedGenericEntity.code,
      });
    });
  });

  describe('deleteByRedemptionId', () => {
    it('should delete generic', async () => {
      // Arrange
      const repository = new GenericsRepository(connection);
      const redemptionEntity = redemptionConfigEntityFactory.build();
      const genericEntity = genericEntityFactory.build({
        redemptionId: redemptionEntity.id,
      });
      await connection.db.insert(redemptionsTable).values(redemptionEntity).execute();
      await connection.db.insert(genericsTable).values(genericEntity).execute();

      // Act
      const result = await repository.deleteByRedemptionId(redemptionEntity.id);

      // Assert
      expect(result).toEqual([{ id: genericEntity.id }]);
      expect(await repository.findOneByRedemptionId(redemptionEntity.id)).toEqual(null);
    });

    it('should handle generic not found', async () => {
      // Arrange
      const repository = new GenericsRepository(connection);

      // Act
      const result = await repository.deleteByRedemptionId('not an id');

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('deleteById', () => {
    it('should delete generic', async () => {
      // Arrange
      const repository = new GenericsRepository(connection);
      const redemptionEntity = redemptionConfigEntityFactory.build();
      const genericEntity = genericEntityFactory.build({
        redemptionId: redemptionEntity.id,
      });
      await connection.db.insert(redemptionsTable).values(redemptionEntity).execute();
      await connection.db.insert(genericsTable).values(genericEntity).execute();

      // Act
      const result = await repository.deleteById(genericEntity.id);

      // Assert
      expect(result).toEqual([{ id: genericEntity.id }]);
      expect(await repository.findOneByRedemptionId(redemptionEntity.id)).toEqual(null);
    });

    it('should handle generic not found', async () => {
      // Arrange
      const repository = new GenericsRepository(connection);

      // Act
      const result = await repository.deleteById('not an id');

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('findOneByRedemptionId', () => {
    it('should return the generic when it exists', async () => {
      // Arrange
      const repository = new GenericsRepository(connection);
      const redemption = redemptionConfigEntityFactory.build();
      const genericEntity = genericEntityFactory.build({
        redemptionId: redemption.id,
      });
      await connection.db.insert(redemptionsTable).values(redemption).execute();
      await connection.db.insert(genericsTable).values(genericEntity).execute();

      // Act
      const result = await repository.findOneByRedemptionId(redemption.id);

      // Assert
      expect(result).toEqual(genericEntity);
    });

    it('should return null when the generic does not exist', async () => {
      // Arrange
      const repository = new GenericsRepository(connection);
      const redemption = redemptionConfigEntityFactory.build();
      await connection.db.insert(redemptionsTable).values(redemption).execute();

      // Act
      const result = await repository.findOneByRedemptionId(redemption.id);

      // Assert
      expect(result).toEqual(null);
    });

    it('should throw an error when there are multiple matching generics matching the redemptionId', async () => {
      // Arrange
      const repository = new GenericsRepository(connection);
      const redemption = redemptionConfigEntityFactory.build();
      const genericEntity1 = genericEntityFactory.build({
        redemptionId: redemption.id,
      });
      const genericEntity2 = genericEntityFactory.build({
        redemptionId: redemption.id,
      });
      await connection.db.insert(redemptionsTable).values(redemption).execute();
      await connection.db.insert(genericsTable).values([genericEntity1, genericEntity2]).execute();

      // Act & Assert
      await expect(() => repository.findOneByRedemptionId(redemption.id)).rejects.toThrow();
    });
  });
});
