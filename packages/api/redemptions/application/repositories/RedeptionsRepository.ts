import { eq } from 'drizzle-orm';

import { DatabaseConnection, IDatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { redemptionsTable } from '@blc-mono/redemptions/libs/database/schema';

export type Redemption = typeof redemptionsTable.$inferSelect;

export interface IRedemptionsRepository {
  findOneByOfferId(offerId: number): Promise<Redemption | null>;
}

export class RedemptionsRepository implements IRedemptionsRepository {
  static readonly key = 'RedemptionsRepository' as const;
  static readonly inject = [DatabaseConnection.key] as const;

  constructor(private readonly connection: IDatabaseConnection) {}

  public async findOneByOfferId(offerId: number): Promise<Redemption | null> {
    const results = await this.connection.db
      .select()
      .from(redemptionsTable)
      .where(eq(redemptionsTable.offerId, offerId))
      .limit(2)
      .execute();

    return this.atMostOne(results);
  }

  /// ====== PRIVATE METHODS ====== ///

  private atMostOne<T>(results: T[]): T | null {
    if (results.length === 0) {
      return null;
    }

    if (results.length > 1) {
      throw new Error('Received multiple results but expected at most one');
    }

    return results[0];
  }
}
