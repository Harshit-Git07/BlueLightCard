import { and, eq, inArray, notInArray } from 'drizzle-orm';

import { DatabaseTransactionConnection } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { ballotEntriesTable, BallotEntryStatus } from '@blc-mono/redemptions/libs/database/schema';

import { Repository } from './Repository';

export type BallotEntriesEntity = typeof ballotEntriesTable.$inferSelect;
export type NewBallotEntriesEntity = typeof ballotEntriesTable.$inferInsert;
export type BallotEntriesEntityWithMemberId = { memberId: (typeof ballotEntriesTable.$inferSelect)['memberId'] };

export interface IBallotEntriesRepository {
  create(ballotEntryEntity: NewBallotEntriesEntity): Promise<Pick<BallotEntriesEntity, 'id'>>;
  findOneById(id: string): Promise<BallotEntriesEntity | null>;
  findOneByBallotAndMemberId(memberId: string, ballotId: string): Promise<BallotEntriesEntity | null>;
  findByBallotIdAndStatus(ballotId: string, status: BallotEntryStatus): Promise<BallotEntriesEntity[]>;
  findMemberIdsByBallotIdAndStatusWithLimitAndOffset(
    ballotId: string,
    status: BallotEntryStatus,
    limit: number,
    offset: number,
  ): Promise<{ memberId: string }[]>;
  updateManyBatchEntriesNotInArray(
    ballotId: string,
    ballotEntryIds: string[],
    status: BallotEntryStatus,
  ): Promise<void>;
  updateManyBatchEntriesInArray(ballotId: string, ballotEntryIds: string[], status: BallotEntryStatus): Promise<void>;
  withTransaction(transaction: DatabaseTransactionConnection): BallotEntriesRepository;
}

export class BallotEntriesRepository extends Repository implements IBallotEntriesRepository {
  static readonly key = 'BallotEntriesRepository' as const;
  static readonly inject = [DatabaseConnection.key] as const;

  public async create(ballotEntryEntity: NewBallotEntriesEntity): Promise<Pick<BallotEntriesEntity, 'id'>> {
    return this.exactlyOne(
      await this.connection.db
        .insert(ballotEntriesTable)
        .values(ballotEntryEntity)
        .returning({ id: ballotEntriesTable.id })
        .execute(),
    );
  }

  public async findOneByBallotAndMemberId(memberId: string, ballotId: string): Promise<BallotEntriesEntity | null> {
    const results = await this.connection.db
      .select()
      .from(ballotEntriesTable)
      .where(and(eq(ballotEntriesTable.memberId, memberId), eq(ballotEntriesTable.ballotId, ballotId)))
      .limit(1)
      .execute();

    return this.atMostOne(results);
  }

  public async findOneById(id: string): Promise<BallotEntriesEntity | null> {
    const result = await this.connection.db
      .select()
      .from(ballotEntriesTable)
      .where(eq(ballotEntriesTable.id, id))
      .execute();
    return this.atMostOne(result);
  }

  public async findByBallotIdAndStatus(ballotId: string, status: BallotEntryStatus): Promise<BallotEntriesEntity[]> {
    return await this.connection.db
      .select()
      .from(ballotEntriesTable)
      .where(and(eq(ballotEntriesTable.ballotId, ballotId), eq(ballotEntriesTable.status, status)))
      .execute();
  }

  public async findMemberIdsByBallotIdAndStatusWithLimitAndOffset(
    ballotId: string,
    status: BallotEntryStatus,
    limit: number,
    offset: number,
  ): Promise<BallotEntriesEntityWithMemberId[]> {
    return await this.connection.db
      .select({ memberId: ballotEntriesTable.memberId })
      .from(ballotEntriesTable)
      .where(and(eq(ballotEntriesTable.ballotId, ballotId), eq(ballotEntriesTable.status, status)))
      .limit(limit)
      .offset(offset)
      .execute();
  }

  public async updateManyBatchEntriesNotInArray(
    ballotId: string,
    ballotEntryIds: string[],
    status: BallotEntryStatus,
  ): Promise<void> {
    await this.connection.db
      .update(ballotEntriesTable)
      .set({ status })
      .where(and(eq(ballotEntriesTable.ballotId, ballotId), notInArray(ballotEntriesTable.id, ballotEntryIds)))
      .execute();
  }

  public async updateManyBatchEntriesInArray(
    ballotId: string,
    ballotEntryIds: string[],
    status: BallotEntryStatus,
  ): Promise<void> {
    await this.connection.db
      .update(ballotEntriesTable)
      .set({ status })
      .where(and(eq(ballotEntriesTable.ballotId, ballotId), inArray(ballotEntriesTable.id, ballotEntryIds)))
      .execute();
  }

  public withTransaction(transaction: DatabaseTransactionConnection): BallotEntriesRepository {
    return new BallotEntriesRepository(transaction);
  }
}
