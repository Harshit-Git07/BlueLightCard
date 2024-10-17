import { and, eq, inArray } from 'drizzle-orm';

import { DatabaseTransactionConnection } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { redemptionsTable } from '@blc-mono/redemptions/libs/database/schema';

import { Repository } from './Repository';

export type RedemptionConfigEntity = typeof redemptionsTable.$inferSelect;
export type UpdateRedemptionConfigEntity = Partial<typeof redemptionsTable.$inferInsert>;
export type NewRedemptionConfigEntity = typeof redemptionsTable.$inferInsert;
export type RedemptionConfigIdEntity = Pick<RedemptionConfigEntity, 'id'>;

export interface IRedemptionConfigRepository {
  findOneById(id: string): Promise<RedemptionConfigEntity | null>;
  findOneByOfferId(offerId: string): Promise<RedemptionConfigEntity | null>;
  updateManyByOfferId(offerIds: string[], update: UpdateRedemptionConfigEntity): Promise<RedemptionConfigIdEntity[]>;
  updateOneByOfferId(offerId: string, update: UpdateRedemptionConfigEntity): Promise<RedemptionConfigIdEntity | null>;
  updateOneById(id: string, update: UpdateRedemptionConfigEntity): Promise<RedemptionConfigIdEntity | null>;
  createRedemption(redemptionData: NewRedemptionConfigEntity): Promise<RedemptionConfigIdEntity>;
  withTransaction(transaction: DatabaseTransactionConnection): IRedemptionConfigRepository;
  deleteById(id: string): Promise<Pick<RedemptionConfigEntity, 'id'>[]>;
}

export class RedemptionConfigRepository extends Repository implements IRedemptionConfigRepository {
  static readonly key = 'RedemptionsRepository' as const;
  static readonly inject = [DatabaseConnection.key] as const;

  public async findOneById(id: string): Promise<RedemptionConfigEntity | null> {
    const results = await this.connection.db
      .select()
      .from(redemptionsTable)
      .where(eq(redemptionsTable.id, id))
      .limit(1)
      .execute();

    return this.atMostOne(results);
  }

  public async findOneByOfferId(offerId: string): Promise<RedemptionConfigEntity | null> {
    const results = await this.connection.db
      .select()
      .from(redemptionsTable)
      .where(eq(redemptionsTable.offerId, offerId))
      .limit(2)
      .execute();

    return this.atMostOne(results);
  }

  public async deleteById(id: string): Promise<Pick<RedemptionConfigEntity, 'id'>[]> {
    return await this.connection.db
      .delete(redemptionsTable)
      .where(eq(redemptionsTable.id, id))
      .returning({ id: redemptionsTable.id })
      .execute();
  }

  public async updateManyByOfferId(
    offerIds: string[],
    updateRedemptionEntity: UpdateRedemptionConfigEntity,
  ): Promise<RedemptionConfigIdEntity[]> {
    return await this.connection.db
      .update(redemptionsTable)
      .set(updateRedemptionEntity)
      .where(and(inArray(redemptionsTable.offerId, offerIds)))
      .returning({
        id: redemptionsTable.id,
      })
      .execute();
  }

  public async updateOneByOfferId(
    offerId: string,
    updateRedemptionEntity: UpdateRedemptionConfigEntity,
  ): Promise<RedemptionConfigIdEntity | null> {
    return this.atMostOne(
      await this.connection.db
        .update(redemptionsTable)
        .set(updateRedemptionEntity)
        .where(eq(redemptionsTable.offerId, offerId))
        .returning({
          id: redemptionsTable.id,
        })
        .execute(),
    );
  }

  public async updateOneById(
    id: string,
    updateRedemptionEntity: UpdateRedemptionConfigEntity,
  ): Promise<RedemptionConfigEntity | null> {
    return this.atMostOne(
      await this.connection.db
        .update(redemptionsTable)
        .set(updateRedemptionEntity)
        .where(eq(redemptionsTable.id, id))
        .returning({
          id: redemptionsTable.id,
          affiliate: redemptionsTable.affiliate,
          connection: redemptionsTable.connection,
          offerType: redemptionsTable.offerType,
          redemptionType: redemptionsTable.redemptionType,
          url: redemptionsTable.url,
          companyId: redemptionsTable.companyId,
          offerId: redemptionsTable.offerId,
        })
        .execute(),
    );
  }

  public async createRedemption(newRedemptionEntity: NewRedemptionConfigEntity): Promise<RedemptionConfigEntity> {
    return this.exactlyOne(
      await this.connection.db.insert(redemptionsTable).values(newRedemptionEntity).returning().execute(),
    );
  }

  public withTransaction(transaction: DatabaseTransactionConnection): RedemptionConfigRepository {
    return new RedemptionConfigRepository(transaction);
  }
}
