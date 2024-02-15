import memoize from 'lodash/memoize.js';

import { DatabaseConnection, DatabaseConnectionType } from './connection';

/**
 * Wraps the provided callback with a database connection and closes the
 * connection when the callback is complete.
 * @deprecated Use `getConnection` instead.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withConnection<Params extends any[], Return>(
  connectionType: DatabaseConnectionType,
  callback: (connection: DatabaseConnection, ...params: Params) => Promise<Return>,
): (...params: Params) => Promise<Return> {
  return async (...params: Params) => {
    const connection = await DatabaseConnection.fromEnvironmentVariables(connectionType);
    const result = await callback(connection, ...params);
    await connection.close();
    return result;
  };
}

/**
 * Runs the provided callback with a database connection and closes the
 * connection when the callback is complete.
 * @deprecated Use `getConnection` instead.
 */
export async function runWithConnection<Return>(
  connectionType: DatabaseConnectionType,
  callback: (connection: DatabaseConnection) => Promise<Return>,
): Promise<Return> {
  const connection = await DatabaseConnection.fromEnvironmentVariables(connectionType);
  const result = await callback(connection);
  await connection.close();
  return result;
}

/**
 * Returns a memoized connection function that retrieves a database connection
 * based on the specified connection type.
 *
 * @param {DatabaseConnectionType} connectionType - The type of database connection.
 * @return {Function} - The memoized connection function.
 */
export const getConnection = memoize((connectionType: DatabaseConnectionType) => {
  return DatabaseConnection.fromEnvironmentVariables(connectionType);
});
