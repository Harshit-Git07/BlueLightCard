import { faker } from '@faker-js/faker';

import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { redemptionsTable } from '@blc-mono/redemptions/libs/database/schema';

import { redemptionFactory } from '../../libs/test/factories/redemption.factory';
import { RedemptionsTestDatabase } from '../../libs/test/helpers/database';

import { RedemptionConfigRepository } from './RedemptionConfigRepository';

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
      const redemption = redemptionFactory.build();
      await connection.db.insert(redemptionsTable).values(redemption).execute();

      // Act
      const result = await repository.findOneByOfferId(redemption.offerId);

      // Assert
      expect(result).toEqual(redemption);
    });

    it('should return null when the redemption does not exist', async () => {
      // Arrange
      const repository = new RedemptionConfigRepository(connection);
      const offerId = faker.number.int({
        min: 1,
        max: 1_000_000,
      });

      // Act
      const result = await repository.findOneByOfferId(offerId);

      // Assert
      expect(result).toEqual(null);
    });

    it('should throw an error when there are multiple matching redemptions matching the offerId', async () => {
      // Arrange
      const repository = new RedemptionConfigRepository(connection);
      const redemption1 = redemptionFactory.build();
      const redemption2 = redemptionFactory.build({
        offerId: redemption1.offerId,
      });
      await connection.db.insert(redemptionsTable).values([redemption1, redemption2]).execute();

      // Act & Assert
      await expect(() => repository.findOneByOfferId(redemption1.offerId)).rejects.toThrow();
    });
  });

  describe('findOneById', () => {
    it('returns the redemption when it exists', async () => {
      const repository = new RedemptionConfigRepository(connection);
      const redemption = redemptionFactory.build();
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

      expect(result).toEqual(undefined);
    });
  });

  describe('updateOneByOfferId', () => {
    it('should update the redemptions record by offer ID', async () => {
      const offerId = 123;
      const redemption = redemptionFactory.build({
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
      const redemptionUpdate = redemptionFactory.build({
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
      expect(redemptionData[0].offerId).toBe(123);
      expect(redemptionData[0].offerType).toBe('in-store');
      expect(redemptionData[0].redemptionType).toBe('generic');
      expect(redemptionData[0].url).toBe(null);
    });
  });

  describe('updateManyByOfferId', () => {
    it.todo('should update the redemptions records by offer IDs');
  });
});
