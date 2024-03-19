import { faker } from '@faker-js/faker';
import { eq } from 'drizzle-orm';

import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { redemptionsTable } from '@blc-mono/redemptions/libs/database/schema';

import { redemptionFactory } from '../test/factories/redemption.factory';
import { RedemptionsTestDatabase } from '../test/helpers/database';

import { Redemption, RedemptionsRepository } from './RedemptionsRepository';

describe('RedemptionsRepository', () => {
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

  describe('updateByOfferId', () => {
    it('should update the redemption when it exists', async () => {
      // Arrange
      const repository = new RedemptionsRepository(connection);
      const redemption = redemptionFactory.build();
      await connection.db.insert(redemptionsTable).values(redemption).execute();
      const redemptionDataToUpdate: Pick<Redemption, 'connection'> = {
        connection: 'direct',
      };

      // Act
      const result = await repository.updateByOfferId(redemption.offerId, redemptionDataToUpdate);

      // Assert
      expect(result).toEqual([{ id: redemption.id }]);
      const updatedRedemption = await connection.db
        .select()
        .from(redemptionsTable)
        .where(eq(redemptionsTable.id, redemption.id))
        .execute();
      expect(updatedRedemption[0].connection).toEqual(redemptionDataToUpdate.connection);
    });

    it('should return an empty array when the redemption does not exist', async () => {
      // Arrange
      const repository = new RedemptionsRepository(connection);
      const offerId = faker.number.int({
        min: 1,
        max: 1_000_000,
      });
      const redemptionDataToUpdate: Pick<Redemption, 'connection'> = {
        connection: 'direct',
      };

      // Act
      const result = await repository.updateByOfferId(offerId, redemptionDataToUpdate);
      // Assert
      expect(result).toEqual([]);
    });
  });
});
