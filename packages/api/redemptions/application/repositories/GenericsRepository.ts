import { eq } from 'drizzle-orm';

import { DatabaseTransactionConnection } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { genericsTable } from '@blc-mono/redemptions/libs/database/schema';

import { Repository } from './Repository';

export type Generic = typeof genericsTable.$inferSelect;

export interface IGenericsRepository {
  findOneByRedemptionId(redemptionId: string): Promise<Generic | null>;
  withTransaction(transaction: DatabaseTransactionConnection): GenericsRepository;
}

export class GenericsRepository extends Repository implements IGenericsRepository {
  static readonly key = 'GenericsRepository' as const;
  static readonly inject = [DatabaseConnection.key] as const;

  public async findOneByRedemptionId(redemptionId: string): Promise<Generic | null> {
    const results = await this.connection.db
      .select()
      .from(genericsTable)
      .where(eq(genericsTable.redemptionId, redemptionId))
      .limit(2)
      .execute();

    return this.atMostOne(results);
  }

  public withTransaction(transaction: DatabaseTransactionConnection): GenericsRepository {
    return new GenericsRepository(transaction);
  }
}
