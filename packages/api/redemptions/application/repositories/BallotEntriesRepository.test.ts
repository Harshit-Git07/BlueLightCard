import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { ballotEntriesTable, ballotsTable, redemptionsTable } from '@blc-mono/redemptions/libs/database/schema';
import { ballotEntryStatusEnum } from '@blc-mono/redemptions/libs/database/schema';
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

  describe('findOneByBallotAndMemberId', () => {
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

  describe('findByBallotIdAndStatus', () => {
    it('returns a ballot entry when given a valid ballotId and status', async () => {
      const repository = new BallotEntriesRepository(connection);
      const redemption = redemptionConfigEntityFactory.build();
      const ballot = ballotActiveEntityFactory().build({ redemptionId: redemption.id });
      const ballotEntry = ballotEntryFactory().build({ ballotId: ballot.id });
      await connection.db.insert(redemptionsTable).values(redemption).execute();
      await connection.db.insert(ballotsTable).values(ballot).execute();
      await connection.db.insert(ballotEntriesTable).values(ballotEntry).execute();

      const result = await repository.findByBallotIdAndStatus(ballot.id, 'pending');

      expect(result?.length).toEqual(1);
    });
  });

  describe('updateManyBatchEntriesInArray', () => {
    it('updates a batch of ballot entries when given a valid ballotId and status', async () => {
      const repository = new BallotEntriesRepository(connection);
      const redemption = redemptionConfigEntityFactory.build();
      const ballot = ballotActiveEntityFactory().build({ redemptionId: redemption.id });
      const ballotEntry = ballotEntryFactory().build({ ballotId: ballot.id });
      await connection.db.insert(redemptionsTable).values(redemption).execute();
      await connection.db.insert(ballotsTable).values(ballot).execute();
      await connection.db.insert(ballotEntriesTable).values(ballotEntry).execute();

      repository.updateManyBatchEntriesInArray(ballot.id, ['ballotEntryId1'], 'pending');
    });
  });

  describe('updateManyBatchEntriesNotInArray', () => {
    it('updates a batch of ballot entries when given a valid ballotId and status', async () => {
      const repository = new BallotEntriesRepository(connection);
      const redemption = redemptionConfigEntityFactory.build();
      const ballot = ballotActiveEntityFactory().build({ redemptionId: redemption.id });
      const ballotEntry = ballotEntryFactory().build({ ballotId: ballot.id });
      await connection.db.insert(redemptionsTable).values(redemption).execute();
      await connection.db.insert(ballotsTable).values(ballot).execute();
      await connection.db.insert(ballotEntriesTable).values(ballotEntry).execute();

      repository.updateManyBatchEntriesNotInArray(ballot.id, ['ballotEntryId1'], 'pending');
    });
  });

  describe('findMemberIdsByBallotIdAndStatusWithLimitAndOffset', () => {
    it('returns a list of member ids when given a valid ballotId, status, limit, and offset', async () => {
      const repository = new BallotEntriesRepository(connection);
      const redemption = redemptionConfigEntityFactory.build();
      const ballot = ballotActiveEntityFactory().build({ redemptionId: redemption.id });

      const ballotEntry1 = ballotEntryFactory().build({
        ballotId: ballot.id,
        memberId: 'memberId1',
        status: ballotEntryStatusEnum.enumValues[1],
      });
      const ballotEntry2 = ballotEntryFactory().build({
        ballotId: ballot.id,
        memberId: 'memberId2',
        status: ballotEntryStatusEnum.enumValues[1],
      });
      const ballotEntry3 = ballotEntryFactory().build({
        ballotId: ballot.id,
        memberId: 'memberId3',
        status: ballotEntryStatusEnum.enumValues[1],
      });
      const ballotEntry4 = ballotEntryFactory().build({
        ballotId: ballot.id,
        memberId: 'memberId4',
        status: ballotEntryStatusEnum.enumValues[0],
      });

      await connection.db.insert(redemptionsTable).values(redemption).execute();
      await connection.db.insert(ballotsTable).values(ballot).execute();
      await connection.db.insert(ballotEntriesTable).values(ballotEntry1).execute();
      await connection.db.insert(ballotEntriesTable).values(ballotEntry2).execute();
      await connection.db.insert(ballotEntriesTable).values(ballotEntry3).execute();
      await connection.db.insert(ballotEntriesTable).values(ballotEntry4).execute();

      const firstResult = await repository.findMemberIdsByBallotIdAndStatusWithLimitAndOffset(
        ballot.id,
        ballotEntryStatusEnum.enumValues[1],
        1,
        0,
      );

      expect(firstResult).toEqual([{ memberId: 'memberId1' }]);

      const secondResult = await repository.findMemberIdsByBallotIdAndStatusWithLimitAndOffset(
        ballot.id,
        ballotEntryStatusEnum.enumValues[1],
        1,
        1,
      );

      expect(secondResult).toEqual([{ memberId: 'memberId2' }]);

      const thirdResult = await repository.findMemberIdsByBallotIdAndStatusWithLimitAndOffset(
        ballot.id,
        ballotEntryStatusEnum.enumValues[1],
        1,
        2,
      );

      expect(thirdResult).toEqual([{ memberId: 'memberId3' }]);

      const forthResult = await repository.findMemberIdsByBallotIdAndStatusWithLimitAndOffset(
        ballot.id,
        ballotEntryStatusEnum.enumValues[1],
        1,
        3,
      );

      expect(forthResult).toEqual([]);
    });
  });
});
