import { waitOn } from '@blc-mono/core/utils/waitOn';
import {
  DatabaseConnectionConfig,
  DatabaseConnectionType,
  DatabaseEndpoint,
  RawDatabaseCredentials,
} from '@blc-mono/redemptions/libs/database/connection';

import { LocalDatabaseConfig } from '../../../config/database';
import { PR_STAGE_REGEX, PRODUCTION_STAGE_REGEX, STAGING_STAGE_REGEX } from '../../../constants/sst';
import { IDatabase } from '../../adapter';
import { runMigrations } from '../migrations/runMigrations';

import { AbstractDatabaseSetupStrategy } from './abstract';

/**
 * This strategy sets up a local database. This is intended for use in development environments only, and is not
 * compatible with other environments as it requires the use of live lambda.
 *
 * @see https://docs.sst.dev/live-lambda-development
 */
export class LocalDatabaseSetupStrategy extends AbstractDatabaseSetupStrategy<LocalDatabaseConfig> {
  public async setup(): Promise<IDatabase> {
    this.ensureAllowedStage();
    const databaseConnectionConfig = this.createConnectionConfig();
    if (this.app.mode !== 'remove') {
      await this.ensureLocalDatabaseIsRunning(databaseConnectionConfig);
      await this.runMigrations(databaseConnectionConfig);
      await this.seed(databaseConnectionConfig);
    }
    return this.createDatabaseAdapter(databaseConnectionConfig);
  }

  private ensureAllowedStage(): void {
    if (process.env.REDEMPTIONS_DANGEROUSLY_ALLOW_DATABASE_SETUP_STRATEGY === 'true') {
      return;
    }

    if (this.app.mode !== 'dev' && this.app.mode !== 'remove') {
      this.logger.warn({
        message: [
          'Local databases are only supported when running "sst dev".',
          'This is because local databases require the use of live lambda.',
        ].join(' '),
      });
    }

    const disallowedStages = [PR_STAGE_REGEX, STAGING_STAGE_REGEX, PRODUCTION_STAGE_REGEX];
    if (disallowedStages.some((stage) => stage.test(this.stack.stage))) {
      throw new Error(
        [
          `This database setup strategy is not allowed in the ${this.stack.stage} stage.`,
          'It is intended for use in local development environments only, as it requires the use of SST live lambda.',
          'The strategy is disallowed for stages matching the regular expressions:',
          `${disallowedStages.map((stage) => stage.toString()).join(', ')}.`,
          'If you are sure you want to use this strategy in this stage, set the environment variable',
          'REDEMPTIONS_DANGEROUSLY_ALLOW_DATABASE_SETUP_STRATEGY=true.',
        ].join(' '),
      );
    }
  }

  private createConnectionConfig(): DatabaseConnectionConfig {
    return new DatabaseConnectionConfig(
      RawDatabaseCredentials.fromRaw(this.config.username, this.config.password),
      DatabaseEndpoint.fromHostAndPort(this.config.host, this.config.port),
      this.config.databaseName,
    );
  }

  private async ensureLocalDatabaseIsRunning(databaseConnectionConfig: DatabaseConnectionConfig): Promise<void> {
    const databaseConnection = await databaseConnectionConfig.toConnection(DatabaseConnectionType.READ_WRITE);
    await waitOn(async () => {
      this.logger.info({
        message: 'Waiting for local database to be ready...',
      });
      const result = await databaseConnection.sql`SELECT version();`;
      this.logger.info({
        message: 'Local database is ready!',
      });
      this.logger.debug({
        message: `Local database version: ${result[0].version}`,
      });
    });
  }

  private async runMigrations(databaseConnectionConfig: DatabaseConnectionConfig): Promise<void> {
    this.logger.info({
      message: 'Running migrations...',
    });
    const databaseConnection = await databaseConnectionConfig.toConnection(DatabaseConnectionType.READ_WRITE);
    await runMigrations(databaseConnection, 'packages/api/redemptions/infrastructure/database/migrations');

    this.logger.info({
      message: 'Migrations complete!',
    });
  }

  private async seed(databaseConnectionConfig: DatabaseConnectionConfig): Promise<void> {
    const databaseConnection = await databaseConnectionConfig.toConnection(DatabaseConnectionType.READ_WRITE);
    await this.seedStrategy.seed(databaseConnection);
  }

  private createDatabaseAdapter(databaseConnectionConfig: DatabaseConnectionConfig): IDatabase {
    return {
      connectionConfig: databaseConnectionConfig,
      getFunctionProps: (props) => ({
        ...props,
        enableLiveDev: true,
        environment: {
          ...databaseConnectionConfig.toEnvironmentVariables(),
          ...props.environment,
        },
      }),
      getBastionHost: () => null,
    };
  }
}
