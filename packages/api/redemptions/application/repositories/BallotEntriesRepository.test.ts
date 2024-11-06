import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { ballotEntriesTable, ballotsTable, redemptionsTable } from '@blc-mono/redemptions/libs/database/schema';
import { ballotActiveEntityFactory } from '@blc-mono/redemptions/libs/test/factories/ballotEntity.factory';
import { ballotEntryFactory } from '@blc-mono/redemptions/libs/test/factories/ballotEntryEntity.factory';

import { redemptionConfigEntityFactory } from '../../libs/test/factories/redemptionConfigEntity.factory';
import { RedemptionsTestDatabase } from '../../libs/test/helpers/database';

import { BallotEntriesRepository } from './BallotEntriesRepository';

describe('BallotEntriesRepository', () => {
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

  describe('create', () => {
    it('creates a ballot entry when given a valid entry', async () => {
      const memberId = '123';
      const repository = new BallotEntriesRepository(connection);
      const redemption = redemptionConfigEntityFactory.build();
      const ballot = ballotActiveEntityFactory().build({ redemptionId: redemption.id });
      const ballotEntry = ballotEntryFactory().build({ ballotId: ballot.id, memberId: memberId });
      await connection.db.insert(redemptionsTable).values(redemption).execute();
      await connection.db.insert(ballotsTable).values(ballot).execute();

      const result = await repository.create(ballotEntry);

      expect(result?.id).toEqual(ballotEntry?.id);
    });
  });

  describe('findOneByRedemptionId', () => {
    it('returns a ballot entry when given a valid memberId and ballotId', async () => {
      const memberId = '123';
      const repository = new BallotEntriesRepository(connection);
      const redemption = redemptionConfigEntityFactory.build();
      const ballot = ballotActiveEntityFactory().build({ redemptionId: redemption.id });
      const ballotEntry = ballotEntryFactory().build({ ballotId: ballot.id, memberId: memberId });
      await connection.db.insert(redemptionsTable).values(redemption).execute();
      await connection.db.insert(ballotsTable).values(ballot).execute();
      await connection.db.insert(ballotEntriesTable).values(ballotEntry).execute();
      const result = await repository.findOneByBallotAndMemberId(memberId, ballot.id);

      expect(result?.id).toEqual(ballotEntry?.id);
    });

    it('returns null when given a ballotId that does not exist', async () => {
      const repository = new BallotEntriesRepository(connection);

      const result = await repository.findOneById('no-exist-ballot-id');

      expect(result).toEqual(null);
    });
  });

  describe('findOneById', () => {
    it('returns a ballotEntry when given a valid ballotEntryId', async () => {
      const repository = new BallotEntriesRepository(connection);
      const redemption = redemptionConfigEntityFactory.build();
      const ballot = ballotActiveEntityFactory().build({ redemptionId: redemption.id });
      const ballotEntry = ballotEntryFactory().build({ ballotId: ballot.id });
      await connection.db.insert(redemptionsTable).values(redemption).execute();
      await connection.db.insert(ballotsTable).values(ballot).execute();
      await connection.db.insert(ballotEntriesTable).values(ballotEntry).execute();

      const result = await repository.findOneById(ballotEntry.id);

      expect(result?.id).toEqual(ballotEntry?.id);
    });

    it('returns null when given a ballotEntryId that does not exist', async () => {
      const repository = new BallotEntriesRepository(connection);

      const result = await repository.findOneById('no-exist-ballot-entry-id');

      expect(result).toEqual(null);
    });
  });
});
