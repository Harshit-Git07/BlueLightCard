import { eq } from 'drizzle-orm';

import { every } from '@blc-mono/core/utils/drizzle';
import { DatabaseTransactionConnection } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { vaultsTable } from '@blc-mono/redemptions/libs/database/schema';

import { Repository } from './Repository';

export type VaultEntity = typeof vaultsTable.$inferSelect;
export type UpdateVaultEntity = Partial<typeof vaultsTable.$inferInsert>;
export type NewVaultEntity = typeof vaultsTable.$inferInsert;

export type VaultFilters = {
  status?: VaultEntity['status'];
};

export interface IVaultsRepository {
  findOneByRedemptionId(redemptionId: string, filters?: VaultFilters): Promise<VaultEntity | null>;
  findOneById(id: string): Promise<VaultEntity | null>;
  updateOneById(id: string, updateVaultEntity: UpdateVaultEntity): Promise<Pick<VaultEntity, 'id'> | undefined>;
  createMany(NewVaultEntities: NewVaultEntity[]): Promise<VaultEntity[]>;
  create(newVaultEntity: NewVaultEntity): Promise<VaultEntity>;
  deleteById(id: string): Promise<Pick<VaultEntity, 'id'>[]>;
  withTransaction(transaction: DatabaseTransactionConnection): VaultsRepository;
}

export class VaultsRepository extends Repository implements IVaultsRepository {
  static readonly key = 'VaultsRepository' as const;
  static readonly inject = [DatabaseConnection.key] as const;

  public async findOneByRedemptionId(redemptionId: string, filters: VaultFilters = {}): Promise<VaultEntity | null> {
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

  public async findOneById(id: string): Promise<VaultEntity | null> {
    const result = await this.connection.db.select().from(vaultsTable).where(eq(vaultsTable.id, id)).execute();
    return this.atMostOne(result);
  }

  public async deleteById(id: string): Promise<Pick<VaultEntity, 'id'>[]> {
    return await this.connection.db
      .delete(vaultsTable)
      .where(eq(vaultsTable.id, id))
      .returning({ id: vaultsTable.id })
      .execute();
  }

  public async updateOneById(
    id: string,
    vaultDataToUpdate: UpdateVaultEntity,
  ): Promise<Pick<VaultEntity, 'id'> | undefined> {
    return await this.connection.db
      .update(vaultsTable)
      .set(vaultDataToUpdate)
      .where(eq(vaultsTable.id, id))
      .returning({
        id: vaultsTable.id,
      })
      .execute()
      .then((result) => result?.at(0));
  }

  public async createMany(vaults: NewVaultEntity[]): Promise<VaultEntity[]> {
    return await this.connection.db.insert(vaultsTable).values(vaults).returning().execute();
  }

  public async create(vault: NewVaultEntity): Promise<VaultEntity> {
    return this.exactlyOne(await this.connection.db.insert(vaultsTable).values(vault).returning().execute());
  }

  public withTransaction(transaction: DatabaseTransactionConnection): VaultsRepository {
    return new VaultsRepository(transaction);
  }
}
