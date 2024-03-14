import { DatabaseConfig } from './type';
import { Stack } from 'sst/constructs';
import { IVpc, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { DatabaseConfigurator } from './config';
import { IDatabaseAdapter } from './IDatabaseAdapter';
import { isDev, isProduction } from '../../../../core/src/utils/checkEnvironment';
import { Database } from './database';
import { EC2Manager } from '../ec2-manager';
import { SecurityGroupManager } from '../security-group-manager';
import { SecretManager } from '../secret-manager';
import { EnvironmentVariablesKeys } from '../../utils/environment-variables';

export class DatabaseAdapter {
  private static _db: IDatabaseAdapter;

  constructor(
    private stack: Stack,
    private iVpc: IVpc,
    private secretManager: SecretManager,
    private securityGroupManager: SecurityGroupManager,
    private ec2Manager: EC2Manager,
  ) {}

  public init(): IDatabaseAdapter {
    const db: Database = new Database(
      this.stack,
      this.iVpc,
      this.secretManager,
      this.securityGroupManager,
      this.ec2Manager,
    );
    const config: DatabaseConfig = new DatabaseConfigurator(db.database).config;
    const adapter: IDatabaseAdapter = this.createDatabaseFunctionProps(db, config);
    if (!isProduction(this.stack.stage)) {
      // Todo: Remove this condition after database Prod setup
      DatabaseAdapter._db = adapter;
    }
    return adapter;
  }

  public static get(): IDatabaseAdapter {
    if (!this._db) {
      throw new Error('DatabaseAdapter not initialized');
    }
    return this._db;
  }

  private createDatabaseFunctionProps(database: Database, config: DatabaseConfig): IDatabaseAdapter {
    return {
      details: database,
      config: config,
      props: (additionalProps) => ({
        ...additionalProps,
        enableLiveDev: isDev(this.stack.stage),
        vpc: this.iVpc,
        vpcSubnets: {
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
          ...additionalProps.vpcSubnets,
        },
        securityGroups: [
          ...(this.securityGroupManager.lambdaToRdsSecurityGroup
            ? [this.securityGroupManager.lambdaToRdsSecurityGroup]
            : []),
          ...(additionalProps.securityGroups ?? []),
        ],
        permissions: ['secretsmanager:GetSecretValue', ...(additionalProps.permissions ?? [])],
        environment: {
          [EnvironmentVariablesKeys.DATABASE_CONFIG]: JSON.stringify(config),
          ...additionalProps.environment,
        },
      }),
    };
  }
}
