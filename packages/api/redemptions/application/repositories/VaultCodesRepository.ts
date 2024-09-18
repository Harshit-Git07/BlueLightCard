import { and, asc, count, eq, gte, isNotNull, isNull, not, or, sql } from 'drizzle-orm';
import lodash from 'lodash';

import { DatabaseTransactionConnection } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { vaultCodesTable, vaultsTable } from '@blc-mono/redemptions/libs/database/schema';

import { Repository } from './Repository';

export type VaultCode = typeof vaultCodesTable.$inferSelect;
export type NewVaultCode = typeof vaultCodesTable.$inferInsert;

export interface IVaultCodesRepository {
  create(vaultCode: NewVaultCode): Promise<Pick<VaultCode, 'id'>>;
  createMany(vaultCodes: NewVaultCode[]): Promise<Pick<VaultCode, 'id'>[]>;
  checkIfMemberReachedMaxCodeClaimed(vaultId: string, memberId: string, maxPerUser: number): Promise<boolean>;
  claimVaultCode(vaultId: string, memberId: string): Promise<Pick<VaultCode, 'code'> | undefined>;
  withTransaction(transaction: DatabaseTransactionConnection): VaultCodesRepository;
  checkVaultCodesRemaining(vaultId: string): Promise<number>;
  findManyByBatchId(batchId: string): Promise<VaultCode[] | null>;
  updateManyByBatchId(batchId: string, update: Partial<VaultCode>): Promise<Pick<VaultCode, 'id'>[] | null>;
  deleteUnclaimedCodesByBatchId(batchId: string): Promise<Pick<VaultCode, 'id'>[]>;
  findClaimedCodesByBatchId(batchId: string): Promise<VaultCode[]>;
  findUnclaimedCodesByBatchId(batchId: string): Promise<VaultCode[]>;
}

export class VaultCodesRepository extends Repository implements IVaultCodesRepository {
  static readonly key = 'VaultCodesRepository' as const;
  static readonly inject = [DatabaseConnection.key] as const;

  public async checkIfMemberReachedMaxCodeClaimed(
    vaultId: string,
    memberId: string,
    maxPerUser: number,
  ): Promise<boolean> {
    const result = await this.connection.db
      .select({
        numOfCodesClaimed: count(),
      })
      .from(vaultCodesTable)
      .where(and(eq(vaultCodesTable.vaultId, vaultId), eq(vaultCodesTable.memberId, memberId)))
      .limit(maxPerUser);
    const numOfCodesClaimed = result[0].numOfCodesClaimed;
    return numOfCodesClaimed >= maxPerUser;
  }

  /**
   * Retrieve 10 unclaimed codes in order of expiry
   * Pick a random code from the list and attempt to assign the code
   * If the code was not successfully claimed, retry with a different code until we succeed or run out of codes
   */
  public async claimVaultCode(vaultId: string, memberId: string): Promise<Pick<VaultCode, 'code'> | undefined> {
    const codes = await this.connection.db
      .select({
        id: vaultCodesTable.id,
        code: vaultCodesTable.code,
      })
      .from(vaultCodesTable)
      .where(
        and(
          eq(vaultCodesTable.vaultId, vaultId),
          or(isNull(vaultCodesTable.memberId), eq(vaultCodesTable.memberId, '')),
        ),
      )
      .limit(10)
      .orderBy(asc(vaultCodesTable.expiry))
      .groupBy(vaultCodesTable.id)
      .execute();

    while (codes.length > 0) {
      // We attempt to claim a random code to minimise the chances
      // of two concurrent requests trying to claim the same code
      const randomIndex = lodash.random(0, codes.length - 1, false);
      const claimCode = await this.connection.db
        .update(vaultCodesTable)
        .set({ memberId })
        .where(
          and(
            eq(vaultCodesTable.id, codes[randomIndex].id),
            or(isNull(vaultCodesTable.memberId), eq(vaultCodesTable.memberId, '')),
          ),
        )
        .returning({
          code: vaultCodesTable.code,
        })
        .execute();
      if (claimCode.length > 0) {
        return claimCode.at(0);
      } else {
        codes.splice(randomIndex, 1);
      }
    }

    return undefined;
  }

  public async create(vaultCode: NewVaultCode): Promise<Pick<VaultCode, 'id'>> {
    return this.exactlyOne(
      await this.connection.db
        .insert(vaultCodesTable)
        .values(vaultCode)
        .returning({ id: vaultCodesTable.id })
        .execute(),
    );
  }

  public async createMany(vaultCodes: NewVaultCode[]): Promise<Pick<VaultCode, 'id'>[]> {
    return await this.connection.db
      .insert(vaultCodesTable)
      .values(vaultCodes)
      .returning({ id: vaultCodesTable.id })
      .execute();
  }

  public withTransaction(transaction: DatabaseTransactionConnection): VaultCodesRepository {
    return new VaultCodesRepository(transaction);
  }

  public async checkVaultCodesRemaining(vaultId: string): Promise<number> {
    const result = await this.connection.db
      .select({
        unclaimedCodes: count(vaultCodesTable).as('unclaimedCodes'),
        vaults: count(vaultsTable).as('vaults'),
      })
      .from(vaultsTable)
      .where(eq(vaultsTable.id, vaultId))
      .leftJoin(
        vaultCodesTable,
        and(
          or(isNull(vaultCodesTable.memberId), eq(vaultCodesTable.memberId, '')),
          gte(vaultCodesTable.expiry, sql`NOW()`),
          eq(vaultCodesTable.vaultId, vaultsTable.id),
        ),
      )
      .execute();
    const vaultCodesStatus = result.at(0);
    if (!vaultCodesStatus || vaultCodesStatus.vaults === 0) {
      throw new Error('Vault codes not found with given vault ID');
    }
    return Number(vaultCodesStatus.unclaimedCodes);
  }

  public findManyByBatchId(batchId: string): Promise<VaultCode[] | null> {
    return this.connection.db.select().from(vaultCodesTable).where(eq(vaultCodesTable.batchId, batchId)).execute();
  }

  public updateManyByBatchId(batchId: string, update: Partial<VaultCode>): Promise<Pick<VaultCode, 'id'>[] | null> {
    return this.connection.db
      .update(vaultCodesTable)
      .set(update)
      .where(eq(vaultCodesTable.batchId, batchId))
      .returning({
        id: vaultCodesTable.id,
      })
      .execute();
  }

  public async deleteUnclaimedCodesByBatchId(batchId: string): Promise<Pick<VaultCode, 'id'>[]> {
    return await this.connection.db
      .delete(vaultCodesTable)
      .where(
        and(
          eq(vaultCodesTable.batchId, batchId),
          or(isNull(vaultCodesTable.memberId), eq(vaultCodesTable.memberId, '')),
        ),
      )
      .returning({ id: vaultCodesTable.id })
      .execute();
  }

  public async findClaimedCodesByBatchId(batchId: string): Promise<VaultCode[]> {
    return await this.connection.db
      .select()
      .from(vaultCodesTable)
      .where(
        and(
          eq(vaultCodesTable.batchId, batchId),
          or(isNotNull(vaultCodesTable.memberId), not(eq(vaultCodesTable.memberId, ''))),
        ),
      )
      .execute();
  }

  public async findUnclaimedCodesByBatchId(batchId: string): Promise<VaultCode[]> {
    return await this.connection.db
      .select()
      .from(vaultCodesTable)
      .where(
        and(
          eq(vaultCodesTable.batchId, batchId),
          or(isNull(vaultCodesTable.memberId), eq(vaultCodesTable.memberId, '')),
        ),
      )
      .execute();
  }
}
