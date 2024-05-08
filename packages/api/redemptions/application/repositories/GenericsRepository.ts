import { eq } from 'drizzle-orm';

import { DatabaseTransactionConnection } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { genericsTable } from '@blc-mono/redemptions/libs/database/schema';

import { Repository } from './Repository';

export type Generic = typeof genericsTable.$inferSelect;
export type UpdateGeneric = Partial<typeof genericsTable.$inferInsert>;
export type NewGeneric = typeof genericsTable.$inferInsert;

export interface IGenericsRepository {
  findOneByRedemptionId(redemptionId: string): Promise<Generic | null>;
  createGeneric(genericData: NewGeneric): Promise<Pick<Generic, 'id'>[]>;
  updateByRedemptionId(redemptionId: string, genericData: UpdateGeneric): Promise<Pick<Generic, 'id'>[]>;
  deleteByRedemptionId(redemptionId: string): Promise<Pick<Generic, 'id'>[]>;
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

  public createGeneric(genericData: NewGeneric): Promise<Pick<Generic, 'id'>[]> {
    return this.connection.db.insert(genericsTable).values(genericData).returning({ id: genericsTable.id }).execute();
  }

  public updateByRedemptionId(redemptionId: string, genericData: UpdateGeneric): Promise<Pick<Generic, 'id'>[]> {
    return this.connection.db
      .update(genericsTable)
      .set(genericData)
      .where(eq(genericsTable.redemptionId, redemptionId))
      .returning({ id: genericsTable.id })
      .execute();
  }

  public deleteByRedemptionId(redemptionId: string): Promise<Pick<Generic, 'id'>[]> {
    return this.connection.db
      .delete(genericsTable)
      .where(eq(genericsTable.redemptionId, redemptionId))
      .returning({ id: genericsTable.id })
      .execute();
  }

  public withTransaction(transaction: DatabaseTransactionConnection): GenericsRepository {
    return new GenericsRepository(transaction);
  }
}
