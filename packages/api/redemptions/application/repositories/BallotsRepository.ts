import { between, eq } from 'drizzle-orm';

import { every } from '@blc-mono/core/utils/drizzle';
import { DatabaseTransactionConnection } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { ballotsTable } from '@blc-mono/redemptions/libs/database/schema';

import { Repository } from './Repository';

export type BallotEntity = typeof ballotsTable.$inferSelect;

export type BallotEntityWithId = { ballotId: (typeof ballotsTable.$inferSelect)['id'] };

export type NewBallotEntity = Omit<typeof ballotsTable.$inferInsert, 'created'>;

export interface IBallotsRepository {
  findBallotsForDrawDate(startDrawDate: Date, endDrawDate: Date): Promise<BallotEntityWithId[]>;
  findOneById(id: string): Promise<BallotEntity | null>;
  findOneByRedemptionId(redemptionId: string): Promise<BallotEntity | null>;
  withTransaction(transaction: DatabaseTransactionConnection): BallotsRepository;
  create(newBallotEntity: NewBallotEntity): Promise<BallotEntity>;
}

export class BallotsRepository extends Repository implements IBallotsRepository {
  static readonly key = 'BallotsRepository' as const;
  static readonly inject = [DatabaseConnection.key] as const;

  public async findBallotsForDrawDate(startDrawDate: Date, endDrawDate: Date): Promise<BallotEntityWithId[]> {
    return await this.connection.db
      .select({ ballotId: ballotsTable.id })
      .from(ballotsTable)
      .where(between(ballotsTable.drawDate, startDrawDate, endDrawDate))
      .execute();
  }

  public async findOneByRedemptionId(redemptionId: string): Promise<BallotEntity | null> {
    const results = await this.connection.db
      .select()
      .from(ballotsTable)
      .where(every(eq(ballotsTable.redemptionId, redemptionId)))
      .limit(1)
      .execute();

    return this.atMostOne(results);
  }

  public async findOneById(id: string): Promise<BallotEntity | null> {
    const result = await this.connection.db.select().from(ballotsTable).where(eq(ballotsTable.id, id)).execute();
    return this.atMostOne(result);
  }

  public withTransaction(transaction: DatabaseTransactionConnection): BallotsRepository {
    return new BallotsRepository(transaction);
  }

  public async create(newBallotEntity: NewBallotEntity): Promise<BallotEntity> {
    const date = new Date();
    return this.exactlyOne(
      await this.connection.db
        .insert(ballotsTable)
        .values({ ...newBallotEntity, created: date })
        .returning()
        .execute(),
    );
  }
}
