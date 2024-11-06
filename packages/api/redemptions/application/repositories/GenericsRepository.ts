import { eq } from 'drizzle-orm';

import { DatabaseTransactionConnection } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { genericsTable } from '@blc-mono/redemptions/libs/database/schema';

import { Repository } from './Repository';

export type GenericEntity = typeof genericsTable.$inferSelect;
export type UpdateGenericEntity = Partial<typeof genericsTable.$inferInsert>;
export type NewGenericEntity = typeof genericsTable.$inferInsert;

export interface IGenericsRepository {
  findOneByRedemptionId(redemptionId: string): Promise<GenericEntity | null>;
  createGeneric(newGenericEntity: NewGenericEntity): Promise<GenericEntity>;
  updateByRedemptionId(
    redemptionId: string,
    updateGenericEntity: UpdateGenericEntity,
  ): Promise<Pick<GenericEntity, 'id'>[]>;
  updateOneById(id: string, genericEntity: UpdateGenericEntity): Promise<GenericEntity | null>;
  deleteById(id: string): Promise<Pick<GenericEntity, 'id'>[]>;
  deleteByRedemptionId(redemptionId: string): Promise<Pick<GenericEntity, 'id'>[]>;
  withTransaction(transaction: DatabaseTransactionConnection): GenericsRepository;
}

export class GenericsRepository extends Repository implements IGenericsRepository {
  static readonly key = 'GenericsRepository' as const;
  static readonly inject = [DatabaseConnection.key] as const;

  public async findOneByRedemptionId(redemptionId: string): Promise<GenericEntity | null> {
    const results = await this.connection.db
      .select()
      .from(genericsTable)
      .where(eq(genericsTable.redemptionId, redemptionId))
      .limit(2)
      .execute();

    return this.atMostOne(results);
  }

  public async createGeneric(genericEntity: NewGenericEntity): Promise<GenericEntity> {
    return this.exactlyOne(await this.connection.db.insert(genericsTable).values(genericEntity).returning().execute());
  }

  public async updateByRedemptionId(
    redemptionId: string,
    genericEntity: UpdateGenericEntity,
  ): Promise<Pick<GenericEntity, 'id'>[]> {
    return await this.connection.db
      .update(genericsTable)
      .set(genericEntity)
      .where(eq(genericsTable.redemptionId, redemptionId))
      .returning({ id: genericsTable.id })
      .execute();
  }

  public async updateOneById(id: string, genericEntity: UpdateGenericEntity): Promise<GenericEntity | null> {
    return this.atMostOne(
      await this.connection.db
        .update(genericsTable)
        .set(genericEntity)
        .where(eq(genericsTable.id, id))
        .returning({
          id: genericsTable.id,
          redemptionId: genericsTable.redemptionId,
          code: genericsTable.code,
        })
        .execute(),
    );
  }

  public async deleteByRedemptionId(redemptionId: string): Promise<Pick<GenericEntity, 'id'>[]> {
    return await this.connection.db
      .delete(genericsTable)
      .where(eq(genericsTable.redemptionId, redemptionId))
      .returning({ id: genericsTable.id })
      .execute();
  }

  public async deleteById(id: string): Promise<Pick<GenericEntity, 'id'>[]> {
    return await this.connection.db
      .delete(genericsTable)
      .where(eq(genericsTable.id, id))
      .returning({ id: genericsTable.id })
      .execute();
  }

  public withTransaction(transaction: DatabaseTransactionConnection): GenericsRepository {
    return new GenericsRepository(transaction);
  }
}
