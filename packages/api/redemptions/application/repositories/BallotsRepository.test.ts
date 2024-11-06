import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { ballotsTable, redemptionsTable } from '@blc-mono/redemptions/libs/database/schema';
import { ballotActiveEntityFactory } from '@blc-mono/redemptions/libs/test/factories/ballotEntity.factory';

import { redemptionConfigEntityFactory } from '../../libs/test/factories/redemptionConfigEntity.factory';
import { RedemptionsTestDatabase } from '../../libs/test/helpers/database';

import { BallotsRepository } from './BallotsRepository';

describe('BallotsRepository', () => {
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
    it('returns a ballot when given a valid redemptionId', async () => {
      const repository = new BallotsRepository(connection);
      const redemption = redemptionConfigEntityFactory.build();
      const ballot = ballotActiveEntityFactory().build({ redemptionId: redemption.id });
      await connection.db.insert(redemptionsTable).values(redemption).execute();
      await connection.db.insert(ballotsTable).values(ballot).execute();

      const result = await repository.findOneByRedemptionId(redemption.id);

      expect(result).toEqual(ballot);
    });

    it('returns null when given a ballotId that does not exist', async () => {
      const repository = new BallotsRepository(connection);

      const result = await repository.findOneById('no-exist-ballot-id');

      expect(result).toEqual(null);
    });
  });

  describe('findOneById', () => {
    it('returns a ballot when given a valid ballotId', async () => {
      const repository = new BallotsRepository(connection);
      const redemption = redemptionConfigEntityFactory.build();
      const ballot = ballotActiveEntityFactory().build({ redemptionId: redemption.id });
      await connection.db.insert(redemptionsTable).values(redemption).execute();
      await connection.db.insert(ballotsTable).values(ballot).execute();

      const result = await repository.findOneById(ballot.id);

      expect(result).toEqual(ballot);
    });

    it('returns null when given a ballotId that does not exist', async () => {
      const repository = new BallotsRepository(connection);

      const result = await repository.findOneById('no-exist-ballot-id');

      expect(result).toEqual(null);
    });
  });
});
