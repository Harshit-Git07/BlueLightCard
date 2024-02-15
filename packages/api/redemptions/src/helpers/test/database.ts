import postgres from 'postgres';
import { DockerComposeEnvironment, Wait } from 'testcontainers';
import { StartedDockerComposeEnvironment } from 'testcontainers/build';
import { Environment } from 'testcontainers/build/types';

import { waitOn } from '@blc-mono/core/utils/waitOn';

import { DatabaseSeedMethod, DatabaseType } from '../../config/database';
import { EnvironmentKeys } from '../../constants/environment';
import {
  DatabaseConnection,
  DatabaseConnectionConfig,
  DatabaseConnectionType,
  DatabaseEndpoint,
  RawDatabaseCredentials,
} from '../../database/connection';
import {
  genericsTable,
  redemptionsTable,
  vaultBatchesTable,
  vaultCodesTable,
  vaultsTable,
} from '../../database/schema';
import { runMigrations } from '../../database/setup/migrations/runMigrations';

export class RedemptionsTestDatabase {
  private constructor(
    private composeEnvironment: StartedDockerComposeEnvironment,
    private databaseConnectionConfig: DatabaseConnectionConfig,
  ) {}
  private static retryCount = 0;

  private static waitForConnection = async (sql: postgres.Sql) => {
    return waitOn(async () => {
      const results = await sql`SELECT * FROM pg_catalog.pg_tables;`;
      if (!results.length) {
        throw new Error('Invalid response from database');
      }
    });
  };

  /**
   * Start a new database instance for testing
   */
  public static async start(): Promise<RedemptionsTestDatabase> {
    // Random port between 7000 and 8000
    const host = 'localhost';
    const port = Math.floor(Math.random() * 1000) + 7000;
    const environment = {
      [EnvironmentKeys.REDEMPTIONS_DATABASE_TYPE]: DatabaseType.LOCAL,
      [EnvironmentKeys.REDEMPTIONS_DATABASE_SEED_METHOD]: DatabaseSeedMethod.DISABLED,
      [EnvironmentKeys.REDEMPTIONS_DATABASE_USER]: 'test',
      [EnvironmentKeys.REDEMPTIONS_DATABASE_PASSWORD]: 'DbusAcWHZOsH',
      [EnvironmentKeys.REDEMPTIONS_DATABASE_NAME]: 'redemptions',
      [EnvironmentKeys.REDEMPTIONS_DATABASE_PORT]: port.toString(),
    } satisfies Environment;

    const composeEnvironment = await new DockerComposeEnvironment('./', 'compose.yaml')
      .withWaitStrategy('db', Wait.forHealthCheck())
      .withEnvironment(environment)
      .up(['db']);

    const databaseConnectionConfig = new DatabaseConnectionConfig(
      RawDatabaseCredentials.fromRaw(
        environment[EnvironmentKeys.REDEMPTIONS_DATABASE_USER],
        environment[EnvironmentKeys.REDEMPTIONS_DATABASE_PASSWORD],
      ),
      DatabaseEndpoint.fromHostAndPort(host, port),
      environment[EnvironmentKeys.REDEMPTIONS_DATABASE_NAME],
    );

    const databaseConnection = await databaseConnectionConfig.toConnection(DatabaseConnectionType.READ_WRITE);
    await this.waitForConnection(databaseConnection.sql);

    await runMigrations(databaseConnection, 'src/database/migrations');

    return new RedemptionsTestDatabase(composeEnvironment, databaseConnectionConfig);
  }

  /**
   * Stop the database
   */
  public async down(): Promise<void> {
    await this.composeEnvironment.down();
  }

  /**
   * Get a connection to the database
   */
  public async getConnection(): Promise<DatabaseConnection> {
    return this.databaseConnectionConfig.toConnection(DatabaseConnectionType.READ_WRITE);
  }

  /**
   * Reset the database to a clean state (deletes the data from all tables)
   */
  public async reset(): Promise<void> {
    const connection = await this.getConnection();
    // The order of deletion is important due to foreign key constraints
    await connection.db.delete(vaultCodesTable).execute();
    await connection.db.delete(vaultBatchesTable).execute();
    await connection.db.delete(vaultsTable).execute();
    await connection.db.delete(genericsTable).execute();
    await connection.db.delete(redemptionsTable).execute();
  }
}
