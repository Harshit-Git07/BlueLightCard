import { ExtractTablesWithRelations } from 'drizzle-orm';
import { PgTransaction } from 'drizzle-orm/pg-core';
import { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';

import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';

export type DatabaseTransactionOperator = PgTransaction<
  PostgresJsQueryResultHKT,
  Record<string, never>,
  ExtractTablesWithRelations<Record<string, never>>
>;
export type DatabaseTransactionConnection = {
  db: DatabaseTransactionOperator;
};

export interface ITransactionManager {
  withTransaction<T>(callback: (transaction: DatabaseTransactionOperator) => Promise<T>): Promise<T>;
}

/**
 * A manager for transactions
 */
export class TransactionManager {
  static readonly key = 'TransactionManager' as const;
  static readonly inject = [DatabaseConnection.key] as const;

  constructor(public connection: DatabaseConnection) {}

  /**
   * Run a callback within a transaction.
   */
  public withTransaction<T>(callback: (transaction: DatabaseTransactionOperator) => Promise<T>): Promise<T> {
    return this.connection.db.transaction(callback);
  }
}
