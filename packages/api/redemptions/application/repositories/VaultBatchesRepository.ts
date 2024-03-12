import { DatabaseTransactionConnection } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { vaultBatchesTable } from '@blc-mono/redemptions/libs/database/schema';

import { Repository } from './Repository';

export type VaultBatch = typeof vaultBatchesTable.$inferSelect;

export interface IVaultBatchesRepository {
  withTransaction(transaction: DatabaseTransactionConnection): VaultBatchesRepository;
}

export class VaultBatchesRepository extends Repository implements IVaultBatchesRepository {
  static readonly key = 'VaultBatchesRepository' as const;
  static readonly inject = [DatabaseConnection.key] as const;

  public withTransaction(transaction: DatabaseTransactionConnection): VaultBatchesRepository {
    return new VaultBatchesRepository(transaction);
  }
}
