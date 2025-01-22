import { IVpc } from 'aws-cdk-lib/aws-ec2';
import { App, Stack } from 'sst/constructs';

import { CliLogger } from '@blc-mono/core/utils/logger/cliLogger';
import { ILogger } from '@blc-mono/core/utils/logger/logger';
import { IBastionHostAdapter } from '@blc-mono/stacks/infra/bastionHost/adapter';

import { DatabaseConfig } from '../../../config/database';
import { IDatabase } from '../../adapter';
import { IDatabaseSeedStrategy } from '../../seed/strategies';
import { BastionHostDefaultSecurityGroup } from '../../types';

export interface IDatabaseSetupStrategy {
  setup(): Promise<IDatabase>;
}

export abstract class AbstractDatabaseSetupStrategy<Config extends DatabaseConfig> implements IDatabaseSetupStrategy {
  constructor(
    protected readonly app: App,
    protected readonly stack: Stack,
    protected readonly vpc: IVpc,
    protected readonly seedStrategy: IDatabaseSeedStrategy,
    protected readonly sharedBastionHost: IBastionHostAdapter | undefined,
    protected readonly config: Config,
    protected readonly logger: ILogger = new CliLogger(),
  ) {}

  public abstract setup(): Promise<IDatabase>;

  protected getBastionHostDefaultSecurityGroup(): BastionHostDefaultSecurityGroup | undefined {
    if (this.sharedBastionHost) {
      return BastionHostDefaultSecurityGroup.of(this.sharedBastionHost.getDefaultsSecurityGroup());
    }
  }
}
