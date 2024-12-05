import { and, between, eq } from 'drizzle-orm';

import { every } from '@blc-mono/core/utils/drizzle';
import { DatabaseTransactionConnection } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { ballotsTable, BallotStatus } from '@blc-mono/redemptions/libs/database/schema';

import { Repository } from './Repository';

export type BallotEntity = typeof ballotsTable.$inferSelect;

export type BallotEntityWithId = { ballotId: (typeof ballotsTable.$inferSelect)['id'] };

export type NewBallotEntity = Omit<typeof ballotsTable.$inferInsert, 'created'>;

export type UpdateBallotEntity = Partial<typeof ballotsTable.$inferInsert>;

export interface IBallotsRepository {
  findBallotsForDrawDate(startDrawDate: Date, endDrawDate: Date): Promise<BallotEntityWithId[]>;
  findOneById(id: string): Promise<BallotEntity | null>;
  findOneByRedemptionId(redemptionId: string): Promise<BallotEntity | null>;
  withTransaction(transaction: DatabaseTransactionConnection): BallotsRepository;
  create(newBallotEntity: NewBallotEntity): Promise<BallotEntity>;
  updateOneById(id: string, updateBallotEntity: UpdateBallotEntity): Promise<Pick<BallotEntity, 'id'> | undefined>;
  updateBallotStatus(ballotId: string, status: BallotStatus): Promise<void>;
  deleteById(id: string): Promise<Pick<BallotEntity, 'id'>[]>;
}

export class BallotsRepository extends Repository implements IBallotsRepository {
  static readonly key = 'BallotsRepository' as const;
  static readonly inject = [DatabaseConnection.key] as const;

  public async findBallotsForDrawDate(startDrawDate: Date, endDrawDate: Date): Promise<BallotEntityWithId[]> {
    return await this.connection.db
      .select({ ballotId: ballotsTable.id })
      .from(ballotsTable)
      .where(and(between(ballotsTable.drawDate, startDrawDate, endDrawDate), eq(ballotsTable.status, 'pending')))
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

  public async updateOneById(
    id: string,
    updateBallotEntity: UpdateBallotEntity,
  ): Promise<Pick<BallotEntity, 'id'> | undefined> {
    return await this.connection.db
      .update(ballotsTable)
      .set(updateBallotEntity)
      .where(eq(ballotsTable.id, id))
      .returning({ id: ballotsTable.id })
      .execute()
      .then((result) => result?.at(0));
  }

  public async updateBallotStatus(ballotId: string, status: BallotStatus): Promise<void> {
    await this.connection.db.update(ballotsTable).set({ status }).where(eq(ballotsTable.id, ballotId)).execute();
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

  public async deleteById(id: string): Promise<Pick<BallotEntity, 'id'>[]> {
    return await this.connection.db
      .delete(ballotsTable)
      .where(eq(ballotsTable.id, id))
      .returning({ id: ballotsTable.id })
      .execute();
  }
}
