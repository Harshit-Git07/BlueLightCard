import { redemptionFactory } from '@blc-mono/redemptions/application/test/factories/redemption.factory';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { createRedemptionsId, genericsTable, redemptionsTable } from '@blc-mono/redemptions/libs/database/schema';

import { genericsFactory } from '../test/factories/generics.factory';
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

  async function createRedemptionsRecord() {
    const redemption = redemptionFactory.build();
    await connection.db.insert(redemptionsTable).values(redemption).execute();
    return redemption.id;
  }

  describe('findOneByRedemptionId', () => {
    it('should return the generics record when it exists', async () => {
      const redemptionId = await createRedemptionsRecord();

      const repository = new GenericsRepository(connection);
      const generic = genericsFactory.build({
        redemptionId: redemptionId,
      });
      await connection.db.insert(genericsTable).values(generic).execute();
      const result = await repository.findOneByRedemptionId(redemptionId);
      expect(result).toEqual(generic);
    });

    it('should return null when the generics record does not exist', async () => {
      const repository = new GenericsRepository(connection);
      const result = await repository.findOneByRedemptionId(createRedemptionsId());
      expect(result).toEqual(null);
    });

    it('should throw an error when there are multiple matching generics record matching the redemptionId', async () => {
      const redemptionId = await createRedemptionsRecord();

      const repository = new GenericsRepository(connection);
      const generic1 = genericsFactory.build({
        redemptionId: redemptionId,
      });
      const generic2 = genericsFactory.build({
        redemptionId: redemptionId,
      });
      await connection.db.insert(genericsTable).values([generic1, generic2]).execute();
      await expect(() => repository.findOneByRedemptionId(redemptionId)).rejects.toThrow();
    });
  });

  describe('createGeneric', () => {
    it('should create the generics record', async () => {
      const redemptionId = await createRedemptionsRecord();

      const repository = new GenericsRepository(connection);
      const generic = genericsFactory.build({
        redemptionId: redemptionId,
      });
      await repository.createGeneric(generic);
      const genericData = await connection.db.select().from(genericsTable).execute();
      expect(genericData.length).toBe(1);
    });
  });

  describe('updateByRedemptionId', () => {
    it('should update the generics record by redemption ID', async () => {
      const redemptionId = await createRedemptionsRecord();

      const generic = genericsFactory.build({
        redemptionId: redemptionId,
        code: 'test-123',
      });
      await connection.db.insert(genericsTable).values(generic).execute();

      const repository = new GenericsRepository(connection);
      const genericUpdate = genericsFactory.build({
        redemptionId: redemptionId,
        code: 'test-123-update',
      });
      await repository.updateByRedemptionId(redemptionId, genericUpdate);
      const genericData = await connection.db.select().from(genericsTable).execute();
      expect(genericData.length).toBe(1);
      expect(genericData[0].redemptionId).toBe(redemptionId);
      expect(genericData[0].code).toBe('test-123-update');
    });
  });

  describe('deleteByRedemptionId', () => {
    it('should delete the generics record by redemption ID', async () => {
      const redemptionId = await createRedemptionsRecord();

      const generic = genericsFactory.build({
        redemptionId: redemptionId,
      });
      await connection.db.insert(genericsTable).values(generic).execute();

      const repository = new GenericsRepository(connection);
      await repository.deleteByRedemptionId(redemptionId);
      const genericData = await connection.db.select().from(genericsTable).execute();
      expect(genericData.length).toBe(0);
    });
  });
});
