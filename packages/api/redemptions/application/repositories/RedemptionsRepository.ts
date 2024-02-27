import { eq } from 'drizzle-orm';

import { DatabaseTransactionConnection } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { redemptionsTable } from '@blc-mono/redemptions/libs/database/schema';

import { Repository } from './Repository';

export type Redemption = typeof redemptionsTable.$inferSelect;
export type UpdateRedemption = Partial<typeof redemptionsTable.$inferInsert>;

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
