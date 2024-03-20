import { ConnectionDetails, DatabaseConfig } from './type';
import { App, Stack } from 'sst/constructs';
import { IVpc, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { DatabaseConfigurator } from './config';
import { IDatabaseAdapter } from './IDatabaseAdapter';
import { isLocal, isProduction } from '../../../../core/src/utils/checkEnvironment';
import { Database } from './database';
import { EC2Manager } from '../ec2-manager';
import { SecurityGroupManager } from '../security-group-manager';
import { SecretManager } from '../secret-manager';
import { EnvironmentVariablesKeys } from '../../utils/environment-variables';
import { DbUtils } from './dbUtils';
import { LOCAL_MIGRATION_FOLDER, Migration } from './migration/migration';
import { IDatabaseConnection } from './iDatabseConnection';

export class DatabaseAdapter {
  constructor(
    private stack: Stack,
    private app: App,
    private iVpc: IVpc,
    private secretManager: SecretManager,
    private securityGroupManager: SecurityGroupManager,
    private ec2Manager: EC2Manager,
  ) {}

  public async init(): Promise<IDatabaseAdapter> {
    const db: Database = new Database(
      this.stack,
      this.iVpc,
      this.secretManager,
      this.securityGroupManager,
      this.ec2Manager,
    );
    const config: DatabaseConfig = new DatabaseConfigurator(db.database).config;
    const adapter: IDatabaseAdapter = this.createDatabaseFunctionProps(db, config);

    if (this.app.mode !== 'remove') {
      await this.runMigration(adapter);
    }
    return adapter;
  }

  private async runMigration(dbAdapter: IDatabaseAdapter) {
    if (isLocal(this.stack.stage)) {
      const connectionDetails: ConnectionDetails = DbUtils.fromLocalEnvironmentVariables();
      const connection: IDatabaseConnection = await DbUtils.createConnection(connectionDetails);
      await Migration.runMigrationsLocally(connection, LOCAL_MIGRATION_FOLDER);
    } else {
      await Migration.runLambdaMigrationScript(this.stack, dbAdapter);
    }
  }

  private createDatabaseFunctionProps(database: Database, config: DatabaseConfig): IDatabaseAdapter {
    return {
      details: database,
      config: config,
      props: (additionalProps) => ({
        ...additionalProps,
        enableLiveDev: isLocal(this.stack.stage),
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
