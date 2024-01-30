import { IVpc } from 'aws-cdk-lib/aws-ec2';
import { App, Stack } from 'sst/constructs';

import { CliLogger } from '@blc-mono/core/utils/logger/cliLogger';
import { ILogger } from '@blc-mono/core/utils/logger/logger';

import { DatabaseConfig } from '../../../config/database';
import { IDatabase } from '../../adapter';
import { IDatabaseSeedStrategy } from '../../seed/strategies';

export interface IDatabaseSetupStrategy {
  setup(): Promise<IDatabase>;
}

export abstract class AbstractDatabaseSetupStrategy<Config extends DatabaseConfig> implements IDatabaseSetupStrategy {
  constructor(
    protected app: App,
    protected stack: Stack,
    protected vpc: IVpc,
    protected seedStrategy: IDatabaseSeedStrategy,
    protected readonly config: Config,
    protected readonly logger: ILogger = new CliLogger(),
  ) {}

  public abstract setup(): Promise<IDatabase>;
}
