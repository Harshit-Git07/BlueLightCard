import { and, asc, count, eq, isNull } from 'drizzle-orm';
import lodash from 'lodash';

import { DatabaseTransactionConnection } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { vaultCodesTable } from '@blc-mono/redemptions/libs/database/schema';

import { Repository } from './Repository';

export type VaultCode = typeof vaultCodesTable.$inferSelect;

export interface IVaultCodesRepository {
  checkIfMemberReachedMaxCodeClaimed(vaultId: string, memberId: string, maxPerUser: number): Promise<boolean>;
  claimVaultCode(vaultId: string, memberId: string): Promise<Pick<VaultCode, 'code'> | undefined>;
  withTransaction(transaction: DatabaseTransactionConnection): VaultCodesRepository;
}

export class VaultCodesRepository extends Repository implements IVaultCodesRepository {
  static readonly key = 'VaultCodesRepository' as const;
  static readonly inject = [DatabaseConnection.key] as const;

  public async checkIfMemberReachedMaxCodeClaimed(
    vaultId: string,
    memberId: string,
    maxPerUser: number,
  ): Promise<boolean> {
    return this.connection.db
      .select({
        numOfCodesClaimed: count(),
      })
      .from(vaultCodesTable)
      .where(and(eq(vaultCodesTable.vaultId, vaultId), eq(vaultCodesTable.memberId, memberId)))
      .limit(maxPerUser)
      .execute()
      .then((result) => {
        const numOfCodesClaimed = result[0].numOfCodesClaimed;
        return numOfCodesClaimed >= maxPerUser ? true : false;
      });
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
      .where(and(eq(vaultCodesTable.vaultId, vaultId), isNull(vaultCodesTable.memberId)))
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
        .where(and(eq(vaultCodesTable.id, codes[randomIndex].id), isNull(vaultCodesTable.memberId)))
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

  public withTransaction(transaction: DatabaseTransactionConnection): VaultCodesRepository {
    return new VaultCodesRepository(transaction);
  }
}
