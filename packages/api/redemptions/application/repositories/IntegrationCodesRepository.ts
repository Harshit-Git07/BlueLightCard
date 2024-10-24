import { and, count, eq } from 'drizzle-orm';

import { DatabaseTransactionConnection } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';
import { integrationCodesTable } from '@blc-mono/redemptions/libs/database/schema';

import { Repository } from './Repository';

export type IntegrationCodeEntity = typeof integrationCodesTable.$inferSelect;
export type NewIntegrationCodeEntity = typeof integrationCodesTable.$inferInsert;

export interface IIntegrationCodesRepository {
  create(integrationCodeEntity: NewIntegrationCodeEntity): Promise<Pick<IntegrationCodeEntity, 'id'>>;
  countCodesClaimedByMember(vaultId: string, integrationId: string, memberId: string): Promise<number>;
  withTransaction(transaction: DatabaseTransactionConnection): IntegrationCodesRepository;
}

export class IntegrationCodesRepository extends Repository implements IIntegrationCodesRepository {
  static readonly key = 'IntegrationRepository' as const;
  static readonly inject = [DatabaseConnection.key] as const;

  public async create(integrationCodeEntity: NewIntegrationCodeEntity): Promise<Pick<IntegrationCodeEntity, 'id'>> {
    return this.exactlyOne(
      await this.connection.db
        .insert(integrationCodesTable)
        .values(integrationCodeEntity)
        .returning({ id: integrationCodesTable.id })
        .execute(),
    );
  }

  public async countCodesClaimedByMember(vaultId: string, integrationId: string, memberId: string): Promise<number> {
    const result = await this.connection.db
      .select({ count: count() })
      .from(integrationCodesTable)
      .where(
        and(
          eq(integrationCodesTable.vaultId, vaultId),
          eq(integrationCodesTable.integrationId, integrationId),
          eq(integrationCodesTable.memberId, memberId),
        ),
      )
      .execute();

    return Number(result[0].count);
  }

  public withTransaction(transaction: DatabaseTransactionConnection): IntegrationCodesRepository {
    return new IntegrationCodesRepository(transaction);
  }
}
