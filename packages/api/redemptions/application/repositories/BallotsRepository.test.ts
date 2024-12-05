import { eq } from 'drizzle-orm';

import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { ballotsTable, redemptionsTable } from '@blc-mono/redemptions/libs/database/schema';
import {
  ballotActiveEntityFactory,
  newBallotEntityFactory,
} from '@blc-mono/redemptions/libs/test/factories/ballotEntity.factory';

import { redemptionConfigEntityFactory } from '../../libs/test/factories/redemptionConfigEntity.factory';
import { RedemptionsTestDatabase } from '../../libs/test/helpers/database';

import { BallotsRepository, NewBallotEntity } from './BallotsRepository';
import { RedemptionConfigEntity } from './RedemptionConfigRepository';

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

  describe('findBallotsForDrawDate', () => {
    it('returns a ballot ids when given a valid date range', async () => {
      const today = new Date();
      const repository = new BallotsRepository(connection);
      const redemption = redemptionConfigEntityFactory.build();
      const ballot = ballotActiveEntityFactory().build({ redemptionId: redemption.id, drawDate: today });
      await connection.db.insert(redemptionsTable).values(redemption).execute();
      await connection.db.insert(ballotsTable).values(ballot).execute();

      const result = await repository.findBallotsForDrawDate(today, today);

      expect(result).toEqual([{ ballotId: ballot.id }]);
    });

    it('returns empty array when no ballots are found', async () => {
      const repository = new BallotsRepository(connection);

      const result = await repository.findBallotsForDrawDate(new Date('2024-01-01'), new Date('2024-01-02'));

      expect(result).toEqual([]);
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

  describe('create', () => {
    it('creates a new ballot', async () => {
      const repository = new BallotsRepository(connection);
      const redemption: RedemptionConfigEntity = redemptionConfigEntityFactory.build();
      const ballot: NewBallotEntity = newBallotEntityFactory.build({
        redemptionId: redemption.id,
        totalTickets: 10,
        offerName: 'offer one',
        drawDate: new Date(),
        eventDate: new Date(),
      });
      await connection.db.insert(redemptionsTable).values(redemption).execute();

      const result = await repository.create(ballot);

      const createdBallot = await connection.db
        .select()
        .from(ballotsTable)
        .where(eq(ballotsTable.redemptionId, redemption.id))
        .execute();

      expect(result).toEqual(createdBallot[0]);
    });
  });

  describe('updateOneById', () => {
    it('update an existing ballot', async () => {
      const repository = new BallotsRepository(connection);
      const redemption: RedemptionConfigEntity = redemptionConfigEntityFactory.build();
      const id = 'bal-123';
      const ballot: NewBallotEntity = newBallotEntityFactory.build({
        id,
        redemptionId: redemption.id,
        totalTickets: 10,
        offerName: 'offer one',
        drawDate: new Date(),
        eventDate: new Date(),
      });
      const updated = { ...ballot, totalTickets: 20 };

      await connection.db.insert(redemptionsTable).values(redemption).execute();

      const created = await repository.create(ballot);

      expect(created.totalTickets).toEqual(ballot.totalTickets);

      await repository.updateOneById(id, updated);

      const updatedBallot = await connection.db
        .select()
        .from(ballotsTable)
        .where(eq(ballotsTable.redemptionId, redemption.id))
        .execute();

      expect(updated.totalTickets).toEqual(updatedBallot[0].totalTickets);
    });
  });

  describe('updateBallotStatus', () => {
    it('update the status of an existing ballot', async () => {
      const repository = new BallotsRepository(connection);
      const redemption: RedemptionConfigEntity = redemptionConfigEntityFactory.build();
      const id = 'bal-123';
      const ballot: NewBallotEntity = newBallotEntityFactory.build({
        id,
        redemptionId: redemption.id,
        totalTickets: 10,
        offerName: 'offer one',
        drawDate: new Date(),
        eventDate: new Date(),
      });

      const updated = { ...ballot, status: 'drawing' };

      await connection.db.insert(redemptionsTable).values(redemption).execute();

      const created = await repository.create(ballot);

      expect(created.status).toEqual('pending');

      await repository.updateBallotStatus(id, 'drawing');

      const updatedBallot = await connection.db
        .select()
        .from(ballotsTable)
        .where(eq(ballotsTable.redemptionId, redemption.id))
        .execute();

      expect(updated.status).toEqual(updatedBallot[0].status);
    });
  });

  describe('deleteBallot', () => {
    it('remove an existing ballot', async () => {
      const repository = new BallotsRepository(connection);
      const redemption: RedemptionConfigEntity = redemptionConfigEntityFactory.build();
      const id = 'bal-123';
      const ballot: NewBallotEntity = newBallotEntityFactory.build({
        id,
        redemptionId: redemption.id,
        totalTickets: 10,
        offerName: 'offer one',
        drawDate: new Date(),
        eventDate: new Date(),
      });

      await connection.db.insert(redemptionsTable).values(redemption).execute();

      await repository.create(ballot);

      await repository.deleteById(id);

      const found = await repository.findOneById(id);

      expect(found).toEqual(null);
    });
  });
});
