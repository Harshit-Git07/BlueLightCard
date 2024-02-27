import { eq } from 'drizzle-orm';

import { DatabaseTransactionConnection } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { vaultsTable } from '@blc-mono/redemptions/libs/database/schema';

import { Repository } from './Repository';

export type Vault = typeof vaultsTable.$inferSelect;
export type UpdateVault = Partial<typeof vaultsTable.$inferInsert>;
export type NewVault = typeof vaultsTable.$inferInsert;

export interface IVaultsRepository {
  findOneByRedemptionId(redemptionId: string): Promise<Vault | null>;
  updateOneById(id: string, vaultDataToUpdate: UpdateVault): Promise<Pick<Vault, 'id'> | undefined>;
  createMany(vaults: NewVault[]): Promise<Pick<Vault, 'id'>[]>;
  withTransaction(transaction: DatabaseTransactionConnection): VaultsRepository;
}

export class VaultsRepository extends Repository implements IVaultsRepository {
  static readonly key = 'VaultsRepository' as const;
  static readonly inject = [DatabaseConnection.key] as const;

  public async findOneByRedemptionId(redemptionId: string): Promise<Vault | null> {
    const results = await this.connection.db
      .select()
      .from(vaultsTable)
      .where(eq(vaultsTable.redemptionId, redemptionId))
      .limit(2)
      .execute();

    return this.atMostOne(results);
  }

  public async updateOneById(id: string, vaultDataToUpdate: UpdateVault): Promise<Pick<Vault, 'id'> | undefined> {
    return this.connection.db
      .update(vaultsTable)
      .set(vaultDataToUpdate)
      .where(eq(vaultsTable.id, id))
      .returning({
        id: vaultsTable.id,
      })
      .execute()
      .then((result) => result?.at(0));
  }

  public async createMany(vaults: NewVault[]): Promise<Pick<Vault, 'id'>[]> {
    return this.connection.db
      .insert(vaultsTable)
      .values(vaults)
      .returning({
        id: vaultsTable.id,
      })
      .execute();
  }

  public withTransaction(transaction: DatabaseTransactionConnection): VaultsRepository {
    return new VaultsRepository(transaction);
  }
}
