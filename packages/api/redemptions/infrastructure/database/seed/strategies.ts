import { IVpc } from 'aws-cdk-lib/aws-ec2';
import { App, Script, Stack } from 'sst/constructs';

import { isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';
import { CliLogger } from '@blc-mono/core/utils/logger/cliLogger';
import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { DatabaseConnection } from '@blc-mono/redemptions/libs/database/connection';

import { RedemptionsStackEnvironmentKeys } from '../../constants/environment';
import { SSTFunction } from '../../constructs/SSTFunction';
import { IDatabase } from '../adapter';

import { seed } from './seed';

export interface IDatabaseSeedStrategy {
  seed(connection: DatabaseConnection): Promise<void>;
  createSeedScript(database: IDatabase, migrationsScript: Script): void;
}

const isAllowedEnvironment = (stage: string) => {
  return !isProduction(stage) && !isStaging(stage);
};

export abstract class AbstractDatabaseSeedStrategy implements IDatabaseSeedStrategy {
  constructor(
    protected readonly app: App,
    protected readonly stack: Stack,
    protected readonly vpc: IVpc,
    protected readonly logger: ILogger = new CliLogger(),
  ) {}

  public abstract seed(connection: DatabaseConnection): Promise<void>;
  public abstract createSeedScript(database: IDatabase, migrationsScript: Script): void;
}

export class SyntheticDataSeedStrategy extends AbstractDatabaseSeedStrategy {
  public async seed(connection: DatabaseConnection): Promise<void> {
    if (this.app.mode === 'remove') {
      return;
    }

    this.ensureAllowedStage();
    this.logger.info({
      message: 'Seeding database...',
    });
    await seed(connection);
    this.logger.info({
      message: 'Database seeded!',
    });
  }

  public createSeedScript(database: IDatabase, migrationsScript: Script) {
    this.ensureAllowedStage();
    const seedFunction = new SSTFunction(this.stack, 'RedemptionsDatabaseSeedFunction', {
      functionName: `redemptions-database-seed-${this.stack.stage}`,
      handler: 'packages/api/redemptions/infrastructure/database/seed/seedHandler.handler',
      database,
    });
    const databaseConnectGrants = seedFunction.getGrants();

    const seedScript = new Script(this.stack, 'DatabaseSeedLambdas', {
      onCreate: seedFunction,
      onUpdate: seedFunction,
    });

    seedScript.node.addDependency(migrationsScript, ...databaseConnectGrants);
  }

  private ensureAllowedStage(): void {
    if (!isAllowedEnvironment(this.stack.stage)) {
      throw new Error(
        [
          `Cannot seed database in stage ${this.stack.stage}.`,
          `Database seeding is not allowed in production or staging environments`,
        ].join(' '),
      );
    }
  }
}

export class DisabledDatabaseSeedStrategy extends AbstractDatabaseSeedStrategy {
  public seed(): Promise<void> {
    this.logWarnings();
    return Promise.resolve();
  }

  public createSeedScript(): void {
    this.logWarnings();
  }

  private logWarnings(): void {
    if (isAllowedEnvironment(this.stack.stage)) {
      this.logger.warn({
        message: [
          "Database seeding is disabled. If this is not intentional, please check you've that you've",
          `set the ${RedemptionsStackEnvironmentKeys.REDEMPTIONS_DATABASE_SEED_METHOD} environment variable correctly.`,
        ].join(' '),
      });
    }
  }
}
