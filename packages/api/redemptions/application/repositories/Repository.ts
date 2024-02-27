import { DatabaseTransactionConnection } from '@blc-mono/redemptions/infrastructure/database/TransactionManager';
import { IDatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';

type DBConnection = IDatabaseConnection | DatabaseTransactionConnection;

/**
 * Base class for all repositories with common methods.
 */
export abstract class Repository {
  constructor(protected readonly connection: DBConnection) {}

  /**
   * Checks if the given results array contains at most one element and returns it.
   * If the array is empty, returns null.
   * Throws an error if the array contains more than one element.
   */
  public atMostOne<T>(results: T[]): T | null {
    if (results.length === 0) {
      return null;
    }

    if (results.length > 1) {
      throw new Error('Received multiple results but expected at most one');
    }

    return results[0];
  }

  public abstract withTransaction(transaction: DatabaseTransactionConnection): Repository;
}
