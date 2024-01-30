import { IVpc } from 'aws-cdk-lib/aws-ec2';
import { App, Stack } from 'sst/constructs';

import { DatabaseSeedMethod, DatabaseType, RedemptionsDatabaseConfigResolver } from '../config/database';

import { DisabledDatabaseSeedStrategy, IDatabaseSeedStrategy, SyntheticDataSeedStrategy } from './seed/strategies';
import { IDatabaseSetupStrategy } from './setup/strategies/abstract';
import { AuroraPgClusterSetupStrategy } from './setup/strategies/auroraPgCluster';
import { LocalDatabaseSetupStrategy } from './setup/strategies/local';
import { RdsPgSingleInstanceSetupStrategy } from './setup/strategies/rdsSingleInstance';

export class RedemptionsDatabase {
  constructor(
    private app: App,
    private stack: Stack,
    public readonly vpc: IVpc,
    public readonly config = RedemptionsDatabaseConfigResolver.for(stack),
  ) {}

  /**
   * Sets up the database. Depending on the environment, this may create a new database in AWS or setup a local
   * database. This will also run migrations and seed the database.
   */
  public async setup(): Promise<void> {
    const seedStrategy = this.getDatabaseSeedStrategy();
    const setupStrategy = this.getDatabaseSetupStrategy(seedStrategy);
    await setupStrategy.setup();
  }

  private getDatabaseSetupStrategy(seedStrategy: IDatabaseSeedStrategy): IDatabaseSetupStrategy {
    const databaseType = this.config.databaseType;
    switch (databaseType) {
      case DatabaseType.LOCAL:
        return new LocalDatabaseSetupStrategy(this.app, this.stack, this.vpc, seedStrategy, this.config);
      case DatabaseType.RDS_PG_SINGLE_INSTANCE:
        return new RdsPgSingleInstanceSetupStrategy(this.app, this.stack, this.vpc, seedStrategy, this.config);
      case DatabaseType.AURORA_PG_CLUSTER:
        return new AuroraPgClusterSetupStrategy(this.app, this.stack, this.vpc, seedStrategy, this.config);
      default:
        throw new Error(`Unknown database type: ${databaseType}`);
    }
  }

  private getDatabaseSeedStrategy(): IDatabaseSeedStrategy {
    switch (this.config.databaseSeedMethod) {
      case DatabaseSeedMethod.SYNTHETIC_DATA:
        return new SyntheticDataSeedStrategy(this.app, this.stack, this.vpc);
      case DatabaseSeedMethod.DISABLED:
        return new DisabledDatabaseSeedStrategy(this.app, this.stack, this.vpc);
      default:
        throw new Error(`Unknown database seed method: ${this.config.databaseSeedMethod}`);
    }
  }
}
