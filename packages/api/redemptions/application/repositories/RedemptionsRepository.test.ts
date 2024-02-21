import { faker } from '@faker-js/faker';

import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { redemptionsTable } from '@blc-mono/redemptions/libs/database/schema';

import { redemptionFactory } from '../test/factories/redemption.factory';
import { RedemptionsTestDatabase } from '../test/helpers/database';

import { RedemptionsRepository } from './RedeptionsRepository';

describe('RedemptionsRespository', () => {
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
      const repository = new RedemptionsRepository(connection);
      const redemption = redemptionFactory.build();
      await connection.db.insert(redemptionsTable).values(redemption).execute();

      // Act
      const result = await repository.findOneByOfferId(redemption.offerId);

      // Assert
      expect(result).toEqual(redemption);
    });

    it('should return null when the redemption does not exist', async () => {
      // Arrange
      const repository = new RedemptionsRepository(connection);
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
      const repository = new RedemptionsRepository(connection);
      const redemption1 = redemptionFactory.build();
      const redemption2 = redemptionFactory.build({
        offerId: redemption1.offerId,
      });
      await connection.db.insert(redemptionsTable).values([redemption1, redemption2]).execute();

      // Act & Assert
      await expect(() => repository.findOneByOfferId(redemption1.offerId)).rejects.toThrow();
    });
  });
});
