import { and, eq } from 'drizzle-orm';

import { DatabaseTransactionConnection } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { ballotEntriesTable } from '@blc-mono/redemptions/libs/database/schema';

import { Repository } from './Repository';

export type BallotEnrtiesEntity = typeof ballotEntriesTable.$inferSelect;
export type NewBallotEnrtiesEntity = typeof ballotEntriesTable.$inferInsert;

export interface IBallotEntriesRepository {
  create(ballotEntryEntity: NewBallotEnrtiesEntity): Promise<Pick<BallotEnrtiesEntity, 'id'>>;
  findOneById(id: string): Promise<BallotEnrtiesEntity | null>;
  findOneByBallotAndMemberId(memberid: string, ballotId: string): Promise<BallotEnrtiesEntity | null>;
  withTransaction(transaction: DatabaseTransactionConnection): BallotEntriesRepository;
}

export class BallotEntriesRepository extends Repository implements IBallotEntriesRepository {
  static readonly key = 'BallotEntriesRepository' as const;
  static readonly inject = [DatabaseConnection.key] as const;

  public async create(ballotEntryEntity: NewBallotEnrtiesEntity): Promise<Pick<BallotEnrtiesEntity, 'id'>> {
    return this.exactlyOne(
      await this.connection.db
        .insert(ballotEntriesTable)
        .values(ballotEntryEntity)
        .returning({ id: ballotEntriesTable.id })
        .execute(),
    );
  }

  public async findOneByBallotAndMemberId(memberId: string, ballotId: string): Promise<BallotEnrtiesEntity | null> {
    const results = await this.connection.db
      .select()
      .from(ballotEntriesTable)
      .where(and(eq(ballotEntriesTable.memberId, memberId), eq(ballotEntriesTable.ballotId, ballotId)))
      .limit(1)
      .execute();

    return this.atMostOne(results);
  }

  public async findOneById(id: string): Promise<BallotEnrtiesEntity | null> {
    const result = await this.connection.db
      .select()
      .from(ballotEntriesTable)
      .where(eq(ballotEntriesTable.id, id))
      .execute();
    return this.atMostOne(result);
  }

  public withTransaction(transaction: DatabaseTransactionConnection): BallotEntriesRepository {
    return new BallotEntriesRepository(transaction);
  }
}
