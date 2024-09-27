import { and, count, eq, isNull } from 'drizzle-orm';

import { DatabaseTransactionConnection } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { vaultBatchesTable, vaultCodesTable } from '@blc-mono/redemptions/libs/database/schema';

import { Repository } from './Repository';

export type VaultBatchEntity = typeof vaultBatchesTable.$inferSelect;
export type NewVaultBatchEntity = typeof vaultBatchesTable.$inferInsert;
export type UpdateVaultBatchEntity = Partial<typeof vaultBatchesTable.$inferInsert>;

export interface IVaultBatchesRepository {
  create(newVaultBatchEntity: NewVaultBatchEntity): Promise<Pick<VaultBatchEntity, 'id'>>;
  findByVaultId(vaultId: string): Promise<VaultBatchEntity[]>;
  getCodesRemaining(batchId: string): Promise<number>;
  deleteById(id: string): Promise<Pick<VaultBatchEntity, 'id'>[]>;
  withTransaction(transaction: DatabaseTransactionConnection): VaultBatchesRepository;
  updateOneById(
    id: string,
    updateVaultBatchEntity: UpdateVaultBatchEntity,
  ): Promise<Pick<VaultBatchEntity, 'id'> | null>;
  findOneById(id: string): Promise<VaultBatchEntity | null>;
}
export class VaultBatchesRepository extends Repository implements IVaultBatchesRepository {
  static readonly key = 'VaultBatchesRepository' as const;
  static readonly inject = [DatabaseConnection.key] as const;

  public async create(vaultBatch: NewVaultBatchEntity): Promise<Pick<VaultBatchEntity, 'id'>> {
    return this.exactlyOne(
      await this.connection.db
        .insert(vaultBatchesTable)
        .values(vaultBatch)
        .returning({ id: vaultBatchesTable.id })
        .execute(),
    );
  }

  public findByVaultId(vaultId: string): Promise<VaultBatchEntity[]> {
    return this.connection.db.select().from(vaultBatchesTable).where(eq(vaultBatchesTable.vaultId, vaultId)).execute();
  }

  public async getCodesRemaining(batchId: string): Promise<number> {
    const result = await this.connection.db
      .select({ codesRemaining: count() })
      .from(vaultCodesTable)
      .where(and(eq(vaultCodesTable.batchId, batchId), isNull(vaultCodesTable.memberId)))
      .execute();

    return result[0].codesRemaining;
  }

  public async deleteById(id: string): Promise<Pick<VaultBatchEntity, 'id'>[]> {
    return await this.connection.db
      .delete(vaultBatchesTable)
      .where(eq(vaultBatchesTable.id, id))
      .returning({ id: vaultBatchesTable.id })
      .execute();
  }

  public withTransaction(transaction: DatabaseTransactionConnection): VaultBatchesRepository {
    return new VaultBatchesRepository(transaction);
  }

  public async findOneById(id: string): Promise<VaultBatchEntity | null> {
    return this.atMostOne(
      await this.connection.db.select().from(vaultBatchesTable).where(eq(vaultBatchesTable.id, id)).execute(),
    );
  }

  public async updateOneById(
    id: string,
    update: Partial<VaultBatchEntity>,
  ): Promise<Pick<VaultBatchEntity, 'id'> | null> {
    return this.atMostOne(
      await this.connection.db
        .update(vaultBatchesTable)
        .set(update)
        .where(eq(vaultBatchesTable.id, id))
        .returning({
          id: vaultBatchesTable.id,
        })
        .execute(),
    );
  }
}
