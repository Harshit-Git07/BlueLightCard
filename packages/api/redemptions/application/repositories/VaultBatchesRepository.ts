import { eq } from 'drizzle-orm';

import { DatabaseTransactionConnection } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { vaultBatchesTable } from '@blc-mono/redemptions/libs/database/schema';

import { Repository } from './Repository';

export type VaultBatch = typeof vaultBatchesTable.$inferSelect;
export type NewVaultBatch = typeof vaultBatchesTable.$inferInsert;

export interface IVaultBatchesRepository {
  create(vaultBatch: NewVaultBatch): Promise<Pick<VaultBatch, 'id'>>;
  withTransaction(transaction: DatabaseTransactionConnection): VaultBatchesRepository;
  findOneByBatchId(batchId: string): Promise<VaultBatch | null>;
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

  public withTransaction(transaction: DatabaseTransactionConnection): VaultBatchesRepository {
    return new VaultBatchesRepository(transaction);
  }

  public async findOneByBatchId(batchId: string): Promise<VaultBatch | null> {
    return this.atMostOne(
      await this.connection.db.select().from(vaultBatchesTable).where(eq(vaultBatchesTable.id, batchId)).execute(),
    );
  }
}
