import { and, count, eq, isNull, or } from 'drizzle-orm';

import { VAULT, VAULTQR } from '@blc-mono/core/constants/redemptions';
import { DatabaseTransactionConnection } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import {
  redemptionsTable,
  vaultBatchesTable,
  vaultCodesTable,
  vaultsTable,
} from '@blc-mono/redemptions/libs/database/schema';

import { Repository } from './Repository';

export type VaultStockRecord = {
  companyId: string;
  offerId: string;
  vaultId: string;
  email: string | null;
  status: string;
  integration: string | null;
};

export type VaultBatchStockRecord = {
  batchId: string;
  expiry: Date;
  unclaimed: number;
};

export interface IVaultStockRepository {
  findAllVaults(): Promise<VaultStockRecord[]>;
  countUnclaimedCodesForVault(vaultId: string): Promise<number>;
  findBatchesForVault(vaultId: string): Promise<VaultBatchStockRecord[]>;
  withTransaction(transaction: DatabaseTransactionConnection): IVaultStockRepository;
}

export class VaultStockRepository extends Repository implements IVaultStockRepository {
  static readonly key = 'VaultStockRepository' as const;
  static readonly inject = [DatabaseConnection.key] as const;

  public async findAllVaults(): Promise<VaultStockRecord[]> {
    return await this.connection.db
      .select({
        companyId: redemptionsTable.companyId,
        offerId: redemptionsTable.offerId,
        vaultId: vaultsTable.id,
        email: vaultsTable.email,
        status: vaultsTable.status,
        integration: vaultsTable.integration,
      })
      .from(redemptionsTable)
      .innerJoin(vaultsTable, eq(redemptionsTable.id, vaultsTable.redemptionId))
      .where(or(eq(redemptionsTable.redemptionType, VAULT), eq(redemptionsTable.redemptionType, VAULTQR)))
      .execute();
  }

  public async countUnclaimedCodesForVault(vaultId: string): Promise<number> {
    const result = await this.connection.db
      .select({ count: count() })
      .from(vaultCodesTable)
      .where(
        and(
          eq(vaultCodesTable.vaultId, vaultId),
          or(isNull(vaultCodesTable.memberId), eq(vaultCodesTable.memberId, '')),
        ),
      )
      .execute();

    return result[0].count;
  }

  public async findBatchesForVault(vaultId: string): Promise<VaultBatchStockRecord[]> {
    return await this.connection.db
      .select({
        batchId: vaultBatchesTable.id,
        expiry: vaultBatchesTable.expiry,
        unclaimed: count(vaultCodesTable).as('unclaimed'),
      })
      .from(vaultBatchesTable)
      .where(eq(vaultBatchesTable.vaultId, vaultId))
      .leftJoin(
        vaultCodesTable,
        and(
          or(isNull(vaultCodesTable.memberId), eq(vaultCodesTable.memberId, '')),
          eq(vaultBatchesTable.id, vaultCodesTable.batchId),
        ),
      )
      .groupBy(vaultBatchesTable.id)
      .execute();
  }

  public withTransaction(transaction: DatabaseTransactionConnection): VaultStockRepository {
    return new VaultStockRepository(transaction);
  }
}
