import { and, eq, inArray } from 'drizzle-orm';

import { DatabaseTransactionConnection } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { redemptionsTable } from '@blc-mono/redemptions/libs/database/schema';

import { Repository } from './Repository';

export type Redemption = typeof redemptionsTable.$inferSelect;
export type UpdateRedemption = Partial<typeof redemptionsTable.$inferInsert>;
export type NewRedemption = typeof redemptionsTable.$inferInsert;
export type RedemptionId = Pick<Redemption, 'id'>;

export interface IRedemptionsRepository {
  findOneById(id: string): Promise<Redemption | null>;
  findOneByOfferId(offerId: number): Promise<Redemption | null>;
  updateManyByOfferId(offerIds: number[], update: UpdateRedemption): Promise<RedemptionId[]>;
  updateOneByOfferId(offerId: number, update: UpdateRedemption): Promise<RedemptionId | null>;
  createRedemption(redemptionData: NewRedemption): Promise<RedemptionId>;
  withTransaction(transaction: DatabaseTransactionConnection): IRedemptionsRepository;
}

export class RedemptionsRepository extends Repository implements IRedemptionsRepository {
  static readonly key = 'RedemptionsRepository' as const;
  static readonly inject = [DatabaseConnection.key] as const;

  public async findOneById(id: string): Promise<Redemption | null> {
    const results = await this.connection.db
      .select()
      .from(redemptionsTable)
      .where(eq(redemptionsTable.id, id))
      .limit(1)
      .execute();

    return results[0];
  }

  public async findOneByOfferId(offerId: number): Promise<Redemption | null> {
    const results = await this.connection.db
      .select()
      .from(redemptionsTable)
      .where(eq(redemptionsTable.offerId, offerId))
      .limit(2)
      .execute();

    return this.atMostOne(results);
  }
  public async updateManyByOfferId(offerIds: number[], update: UpdateRedemption): Promise<RedemptionId[]> {
    return await this.connection.db
      .update(redemptionsTable)
      .set(update)
      .where(and(inArray(redemptionsTable.offerId, offerIds)))
      .returning({
        id: redemptionsTable.id,
      })
      .execute();
  }

  public async updateOneByOfferId(offerId: number, update: UpdateRedemption): Promise<RedemptionId | null> {
    return this.atMostOne(
      await this.connection.db
        .update(redemptionsTable)
        .set(update)
        .where(eq(redemptionsTable.offerId, offerId))
        .returning({
          id: redemptionsTable.id,
        })
        .execute(),
    );
  }

  public async createRedemption(redemptionData: NewRedemption): Promise<RedemptionId> {
    return this.exactlyOne(
      await this.connection.db
        .insert(redemptionsTable)
        .values(redemptionData)
        .returning({ id: redemptionsTable.id })
        .execute(),
    );
  }

  public withTransaction(transaction: DatabaseTransactionConnection): RedemptionsRepository {
    return new RedemptionsRepository(transaction);
  }
}
