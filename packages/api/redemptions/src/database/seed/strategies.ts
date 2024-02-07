import { IVpc } from 'aws-cdk-lib/aws-ec2';
import { App, Function as SSTFunction, Script, Stack } from 'sst/constructs';

import { CliLogger } from '@blc-mono/core/utils/logger/cliLogger';
import { ILogger } from '@blc-mono/core/utils/logger/logger';

import { EnvironmentKeys } from '../../constants/environment';
import { PRODUCTION_STAGE, STAGING_STAGE } from '../../constants/sst';
import { IDatabase } from '../adapter';
import { DatabaseConnectionType } from '../connection';
import { runWithConnection } from '../connectionHelpers';

import { seed } from './seed';

export interface IDatabaseSeedStrategy {
  seed(): Promise<void>;
  createSeedScript(database: IDatabase, migrationsScript: Script): void;
}

const STAGES_WITHOUT_SEEDING = [STAGING_STAGE, PRODUCTION_STAGE];

export abstract class AbstractDatabaseSeedStrategy implements IDatabaseSeedStrategy {
  constructor(
    protected readonly app: App,
    protected readonly stack: Stack,
    protected readonly vpc: IVpc,
    protected readonly logger: ILogger = new CliLogger(),
  ) {}

  public abstract seed(): Promise<void>;
  public abstract createSeedScript(database: IDatabase, migrationsScript: Script): void;
}

export class SyntheticDataSeedStrategy extends AbstractDatabaseSeedStrategy {
  public async seed(): Promise<void> {
    if (this.app.mode === 'remove') {
      return;
    }

    this.ensureAllowedStage();
    this.logger.info({
      message: 'Seeding database...',
    });
    await runWithConnection(DatabaseConnectionType.READ_WRITE, seed);
    this.logger.info({
      message: 'Database seeded!',
    });
  }

  public createSeedScript(database: IDatabase, migrationsScript: Script) {
    this.ensureAllowedStage();
    const seedFunction = new SSTFunction(
      this.stack,
      'RedemptionsDatabaseSeedLambda',
      database.getFunctionProps({
        handler: 'packages/api/redemptions/src/database/seed/seedHandler.handler',
        functionName: `redemptions-database-seed-${this.stack.stage}`,
      }),
    );

    const databaseConnectGrants = database.grantConnect(seedFunction);

    const seedScript = new Script(this.stack, 'DatabaseSeedLambdas', {
      onCreate: seedFunction,
      onUpdate: seedFunction,
    });

    seedScript.node.addDependency(migrationsScript, ...databaseConnectGrants);
  }

  private ensureAllowedStage(): void {
    if (STAGES_WITHOUT_SEEDING.includes(this.stack.stage)) {
      throw new Error(
        [
          `Cannot seed database in stage ${this.stack.stage}.`,
          `Database seeding is not allowed in these stages: ${STAGES_WITHOUT_SEEDING.join(', ')}`,
        ].join(' '),
      );
    }
  }
}

export class DisabledDatabaseSeedStrategy extends AbstractDatabaseSeedStrategy {
  public async seed(): Promise<void> {
    this.logWarnings();
  }

  public createSeedScript(): void {
    this.logWarnings();
  }

  private logWarnings(): void {
    if (!STAGES_WITHOUT_SEEDING.includes(this.stack.stage)) {
      this.logger.warn({
        message: [
          "Database seeding is disabled. If this is not intentional, please check you've that you've",
          `set the ${EnvironmentKeys.REDEMPTIONS_DATABASE_SEED_METHOD} environment variable correctly.`,
        ].join(' '),
      });
    }
  }
}
