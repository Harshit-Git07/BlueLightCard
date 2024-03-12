import { and, eq, inArray } from 'drizzle-orm';

import { RedemptionUpdate } from '@blc-mono/redemptions/application/services/dataSync/Promotions/PromotionUpdateService';
import { DatabaseTransactionConnection } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { redemptionsTable } from '@blc-mono/redemptions/libs/database/schema';

import { Repository } from './Repository';

export type Redemption = typeof redemptionsTable.$inferSelect;
export type UpdateRedemption = Partial<typeof redemptionsTable.$inferInsert>;
export interface RedemptionUpdateResults {
  id: string;
}

export interface IRedemptionsRepository {
  findOneByOfferId(offerId: number): Promise<Redemption | null>;
  updateByOfferId(offerId: number, redemptionDataToUpdate: UpdateRedemption): Promise<Pick<Redemption, 'id'>[]>;
  withTransaction(transaction: DatabaseTransactionConnection): RedemptionsRepository;
}

export class RedemptionsRepository extends Repository implements IRedemptionsRepository {
  static readonly key = 'RedemptionsRepository' as const;
  static readonly inject = [DatabaseConnection.key] as const;

  public async findOneByOfferId(offerId: number): Promise<Redemption | null> {
    const results = await this.connection.db
      .select()
      .from(redemptionsTable)
      .where(eq(redemptionsTable.offerId, offerId))
      .limit(2)
      .execute();

    return this.atMostOne(results);
  }
  public async updateManyByOfferId(redemptionUpdate: RedemptionUpdate): Promise<RedemptionUpdateResults[]> {
    const { connection, url, offerType, affiliate } = redemptionUpdate;

    const meta = redemptionUpdate.meta;

    return await this.connection.db.transaction(async (dbTransaction) => {
      const result = await dbTransaction
        .update(redemptionsTable)
        .set({
          affiliate,
          url,
          connection,
          offerType,
        })
        .where(
          and(
            inArray(
              redemptionsTable.offerId,
              meta.dependentEntities.map((entity) => entity.offerId),
            ),
          ),
        )
        .returning({
          id: redemptionsTable.id,
        })
        .execute();
      if (result.length > 1) {
        dbTransaction.rollback();
        throw new Error('Error in updating the redemption more than 1 row was updated');
      }
      return result;
    });
  }

  public async updateByOfferId(
    offerId: number,
    redemptionDataToUpdate: UpdateRedemption,
  ): Promise<Pick<Redemption, 'id'>[]> {
    return this.connection.db
      .update(redemptionsTable)
      .set(redemptionDataToUpdate)
      .where(eq(redemptionsTable.offerId, offerId))
      .returning({
        id: redemptionsTable.id,
      })
      .execute();
  }

  public withTransaction(transaction: DatabaseTransactionConnection): RedemptionsRepository {
    return new RedemptionsRepository(transaction);
  }
}
