import { faker } from '@faker-js/faker';

import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { redemptionsTable } from '@blc-mono/redemptions/libs/database/schema';

import { redemptionConfigEntityFactory } from '../../libs/test/factories/redemptionConfigEntity.factory';
import { RedemptionsTestDatabase } from '../../libs/test/helpers/database';

import { RedemptionConfigRepository, UpdateRedemptionConfigEntity } from './RedemptionConfigRepository';

describe('RedemptionConfigRepository', () => {
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

  describe('findOneByOfferId', () => {
    it('should return the redemption when it exists', async () => {
      // Arrange
      const repository = new RedemptionConfigRepository(connection);
      const redemption = redemptionConfigEntityFactory.build();
      await connection.db.insert(redemptionsTable).values(redemption).execute();

      // Act
      const result = await repository.findOneByOfferId(redemption.offerId);

      // Assert
      expect(result).toEqual(redemption);
    });

    it('should return null when the redemption does not exist', async () => {
      // Arrange
      const repository = new RedemptionConfigRepository(connection);
      const offerId = faker.string.sample(10);

      // Act
      const result = await repository.findOneByOfferId(offerId);

      // Assert
      expect(result).toEqual(null);
    });

    it('should throw an error when there are multiple matching redemptions matching the offerId', async () => {
      // Arrange
      const repository = new RedemptionConfigRepository(connection);
      const redemption1 = redemptionConfigEntityFactory.build();
      const redemption2 = redemptionConfigEntityFactory.build({
        offerId: redemption1.offerId,
      });
      await connection.db.insert(redemptionsTable).values([redemption1, redemption2]).execute();

      // Act & Assert
      await expect(() => repository.findOneByOfferId(redemption1.offerId)).rejects.toThrow();
    });
  });

  describe('deleteById', () => {
    it('should delete redemption configuration', async () => {
      // Arrange
      const repository = new RedemptionConfigRepository(connection);
      const redemptionEntity = redemptionConfigEntityFactory.build();

      await connection.db.insert(redemptionsTable).values(redemptionEntity).execute();

      expect(await repository.findOneById(redemptionEntity.id)).toEqual(redemptionEntity);

      // Act
      const result = await repository.deleteById(redemptionEntity.id);

      // Assert
      expect(result).toEqual([{ id: redemptionEntity.id }]);
      expect(await repository.findOneById(redemptionEntity.id)).toEqual(null);
    });

    it('should handle redemption configuration not found', async () => {
      // Arrange
      const repository = new RedemptionConfigRepository(connection);

      // Act
      const result = await repository.deleteById('not an id');

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('findOneById', () => {
    it('returns the redemption when it exists', async () => {
      const repository = new RedemptionConfigRepository(connection);
      const redemption = redemptionConfigEntityFactory.build();
      await connection.db.insert(redemptionsTable).values(redemption).execute();

      const result = await repository.findOneById(redemption.id);

      expect(result).toEqual(redemption);
    });

    it('returns undefined when the redemption does not exist', async () => {
      const repository = new RedemptionConfigRepository(connection);
      const id = faker.number
        .int({
          min: 1,
          max: 1_000_000,
        })
        .toString();

      const result = await repository.findOneById(id);

      expect(result).toEqual(null);
    });
  });

  describe('updateOneByOfferId', () => {
    it('should update the redemptions record by offer ID', async () => {
      const offerId = '123';
      const redemption = redemptionConfigEntityFactory.build({
        offerId: offerId,
        companyId: 123,
        redemptionType: 'preApplied',
        connection: 'direct',
        offerType: 'online',
        url: 'https://www.awin1.com',
        affiliate: 'awin',
      });
      await connection.db.insert(redemptionsTable).values(redemption).execute();

      const repository = new RedemptionConfigRepository(connection);
      const redemptionUpdate = redemptionConfigEntityFactory.build({
        offerId: offerId,
        companyId: 123,
        redemptionType: 'generic',
        connection: 'none',
        offerType: 'in-store',
        url: null,
        affiliate: null,
      });
      await repository.updateOneByOfferId(offerId, redemptionUpdate);
      const redemptionData = await connection.db.select().from(redemptionsTable).execute();
      expect(redemptionData.length).toBe(1);
      expect(redemptionData[0].affiliate).toBe(null);
      expect(redemptionData[0].companyId).toBe(123);
      expect(redemptionData[0].connection).toBe('none');
      expect(redemptionData[0].offerId).toBe('123');
      expect(redemptionData[0].offerType).toBe('in-store');
      expect(redemptionData[0].redemptionType).toBe('generic');
      expect(redemptionData[0].url).toBe(null);
    });
  });

  describe('updateOneById', () => {
    it('should update the redemptions record by ID and return updated record', async () => {
      const redemption = redemptionConfigEntityFactory.build({
        offerId: '123',
        companyId: 456,
        redemptionType: 'generic',
        connection: 'direct',
        offerType: 'online',
        url: 'https://www.direct.com',
        affiliate: null,
      });
      await connection.db.insert(redemptionsTable).values(redemption).execute();

      const repository = new RedemptionConfigRepository(connection);
      const updatePayload: UpdateRedemptionConfigEntity = {
        offerId: '321',
        companyId: 654,
        connection: 'affiliate',
        url: 'https://www.awin1.com',
        affiliate: 'awin',
      };

      const updatedRecord = await repository.updateOneById(redemption.id, updatePayload);

      expect(updatedRecord).toStrictEqual({
        id: redemption.id,
        affiliate: updatePayload.affiliate,
        connection: updatePayload.connection,
        offerType: redemption.offerType,
        redemptionType: redemption.redemptionType,
        url: updatePayload.url,
        companyId: updatePayload.companyId,
        offerId: updatePayload.offerId,
      });
    });

    it('should not update non-existent record and return null', async () => {
      const repository = new RedemptionConfigRepository(connection);
      const updatePayload: UpdateRedemptionConfigEntity = redemptionConfigEntityFactory.build();
      const updatedRecord = await repository.updateOneById('non-exist-id', updatePayload);
      expect(updatedRecord).toBe(null);
    });
  });

  describe('updateManyByOfferId', () => {
    it.todo('should update the redemptions records by offer IDs');
  });

  describe('updateOneById', () => {
    it('should update the redemptions record by ID and return updated record', async () => {
      const redemption = redemptionConfigEntityFactory.build({
        offerId: '123',
        companyId: 456,
        redemptionType: 'generic',
        connection: 'direct',
        offerType: 'online',
        url: 'https://www.direct.com',
        affiliate: null,
      });
      await connection.db.insert(redemptionsTable).values(redemption).execute();

      const repository = new RedemptionConfigRepository(connection);
      const updatePayload: UpdateRedemptionConfigEntity = {
        offerId: '321',
        companyId: 654,
        connection: 'affiliate',
        url: 'https://www.awin1.com',
        affiliate: 'awin',
      };

      const updatedRecord = await repository.updateOneById(redemption.id, updatePayload);

      expect(updatedRecord).toStrictEqual({
        id: redemption.id,
        affiliate: updatePayload.affiliate,
        connection: updatePayload.connection,
        offerType: redemption.offerType,
        redemptionType: redemption.redemptionType,
        url: updatePayload.url,
        companyId: updatePayload.companyId,
        offerId: updatePayload.offerId,
      });
    });

    it('should not update non-existent record and return null', async () => {
      const repository = new RedemptionConfigRepository(connection);
      const updatePayload: UpdateRedemptionConfigEntity = redemptionConfigEntityFactory.build();
      const updatedRecord = await repository.updateOneById('non-exist-id', updatePayload);
      expect(updatedRecord).toBe(null);
    });
  });
});
