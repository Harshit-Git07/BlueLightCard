import { eq } from 'drizzle-orm';

import { every } from '@blc-mono/core/utils/drizzle';
import { DatabaseTransactionConnection } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { vaultsTable } from '@blc-mono/redemptions/libs/database/schema';

import { Repository } from './Repository';

export type Vault = typeof vaultsTable.$inferSelect;
export type UpdateVault = Partial<typeof vaultsTable.$inferInsert>;
export type NewVault = typeof vaultsTable.$inferInsert;

export type VaultFilters = {
  status?: Vault['status'];
};

export interface IVaultsRepository {
  findOneByRedemptionId(redemptionId: string, filters?: VaultFilters): Promise<Vault | null>;
  findOneById(id: string): Promise<Vault | null>;
  updateOneById(id: string, vaultDataToUpdate: UpdateVault): Promise<Pick<Vault, 'id'> | undefined>;
  createMany(vaults: NewVault[]): Promise<Pick<Vault, 'id'>[]>;
  create(vault: NewVault): Promise<Pick<Vault, 'id'>>;
  withTransaction(transaction: DatabaseTransactionConnection): VaultsRepository;
}

export class VaultsRepository extends Repository implements IVaultsRepository {
  static readonly key = 'VaultsRepository' as const;
  static readonly inject = [DatabaseConnection.key] as const;

  public async findOneByRedemptionId(redemptionId: string, filters: VaultFilters = {}): Promise<Vault | null> {
    const results = await this.connection.db
      .select()
      .from(vaultsTable)
      .where(
        every(eq(vaultsTable.redemptionId, redemptionId), filters.status && eq(vaultsTable.status, filters.status)),
      )
      .limit(2)
      .execute();

    return this.atMostOne(results);
  }

  public async findOneById(id: string): Promise<Vault | null> {
    const result = await this.connection.db.select().from(vaultsTable).where(eq(vaultsTable.id, id)).execute();
    return this.atMostOne(result);
  }

  public updateOneById(id: string, vaultDataToUpdate: UpdateVault): Promise<Pick<Vault, 'id'> | undefined> {
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

  public createMany(vaults: NewVault[]): Promise<Pick<Vault, 'id'>[]> {
    return this.connection.db
      .insert(vaultsTable)
      .values(vaults)
      .returning({
        id: vaultsTable.id,
      })
      .execute();
  }

  public async create(vault: NewVault): Promise<Pick<Vault, 'id'>> {
    return this.exactlyOne(
      await this.connection.db.insert(vaultsTable).values(vault).returning({ id: vaultsTable.id }).execute(),
    );
  }

  public withTransaction(transaction: DatabaseTransactionConnection): VaultsRepository {
    return new VaultsRepository(transaction);
  }
}
