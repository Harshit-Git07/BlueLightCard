import { and, count, eq, isNull } from 'drizzle-orm';

import { DatabaseTransactionConnection } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { vaultBatchesTable, vaultCodesTable } from '@blc-mono/redemptions/libs/database/schema';

import { Repository } from './Repository';

export type VaultBatch = typeof vaultBatchesTable.$inferSelect;
export type NewVaultBatch = typeof vaultBatchesTable.$inferInsert;
export type UpdateVaultBatch = Partial<typeof vaultBatchesTable.$inferInsert>;

export interface IVaultBatchesRepository {
  create(vaultBatch: NewVaultBatch): Promise<Pick<VaultBatch, 'id'>>;
  findByVaultId(vaultId: string): Promise<VaultBatch[]>;
  getCodesRemaining(batchId: string): Promise<number>;
  withTransaction(transaction: DatabaseTransactionConnection): VaultBatchesRepository;
  updateOneById(id: string, update: UpdateVaultBatch): Promise<Pick<VaultBatch, 'id'> | null>;
  findOneById(id: string): Promise<VaultBatch | null>;
}
export class VaultBatchesRepository extends Repository implements IVaultBatchesRepository {
  static readonly key = 'VaultBatchesRepository' as const;
  static readonly inject = [DatabaseConnection.key] as const;

  public async create(vaultBatch: NewVaultBatch): Promise<Pick<VaultBatch, 'id'>> {
    return this.exactlyOne(
      await this.connection.db
        .insert(vaultBatchesTable)
        .values(vaultBatch)
        .returning({ id: vaultBatchesTable.id })
        .execute(),
    );
  }

  public findByVaultId(vaultId: string): Promise<VaultBatch[]> {
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

  public withTransaction(transaction: DatabaseTransactionConnection): VaultBatchesRepository {
    return new VaultBatchesRepository(transaction);
  }

  public async findOneById(id: string): Promise<VaultBatch | null> {
    return this.atMostOne(
      await this.connection.db.select().from(vaultBatchesTable).where(eq(vaultBatchesTable.id, id)).execute(),
    );
  }

  public async updateOneById(id: string, update: Partial<VaultBatch>): Promise<Pick<VaultBatch, 'id'> | null> {
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
