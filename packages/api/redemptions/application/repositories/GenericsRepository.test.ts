import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { genericsTable, redemptionsTable } from '@blc-mono/redemptions/libs/database/schema';

import { genericFactory } from '../test/factories/generic.factory';
import { redemptionFactory } from '../test/factories/redemption.factory';
import { RedemptionsTestDatabase } from '../test/helpers/database';

import { GenericsRepository } from './GenericsRepository';

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

  describe('findOneByRedemptionId', () => {
    it('should return the generic when it exists', async () => {
      // Arrange
      const repository = new GenericsRepository(connection);
      const redemption = redemptionFactory.build();
      const generic = genericFactory.build({
        redemptionId: redemption.id,
      });
      await connection.db.insert(redemptionsTable).values(redemption).execute();
      await connection.db.insert(genericsTable).values(generic).execute();

      // Act
      const result = await repository.findOneByRedemptionId(redemption.id);

      // Assert
      expect(result).toEqual(generic);
    });

    it('should return null when the generic does not exist', async () => {
      // Arrange
      const repository = new GenericsRepository(connection);
      const redemption = redemptionFactory.build();
      await connection.db.insert(redemptionsTable).values(redemption).execute();

      // Act
      const result = await repository.findOneByRedemptionId(redemption.id);

      // Assert
      expect(result).toEqual(null);
    });

    it('should throw an error when there are multiple matching generics matching the redemptionId', async () => {
      // Arrange
      const repository = new GenericsRepository(connection);
      const redemption = redemptionFactory.build();
      const generic1 = genericFactory.build({
        redemptionId: redemption.id,
      });
      const generic2 = genericFactory.build({
        redemptionId: redemption.id,
      });
      await connection.db.insert(redemptionsTable).values(redemption).execute();
      await connection.db.insert(genericsTable).values([generic1, generic2]).execute();

      // Act & Assert
      await expect(() => repository.findOneByRedemptionId(redemption.id)).rejects.toThrow();
    });
  });
});
