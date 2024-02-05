import { Duration } from 'aws-cdk-lib';
import { InstanceClass, InstanceSize, InstanceType, Port, SecurityGroup, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { DatabaseInstance, DatabaseInstanceEngine, PostgresEngineVersion, StorageType } from 'aws-cdk-lib/aws-rds';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { Function, Script } from 'sst/constructs';

import { DatabaseType, RdsPgSingleInstanceDatabaseConfig } from '../../../config/database';
import { EnvironmentKeys } from '../../../constants/environment';
import { PRODUCTION_STAGE, STAGING_STAGE } from '../../../constants/sst';
import { IDatabase } from '../../adapter';
import { DatabaseConnectionConfig, DatabaseEndpoint, SecretsManagerDatabaseCredentials } from '../../connection';
import { DatabaseEgressSecurityGroup, DatabaseIngressSecurityGroup } from '../../types';
import { MIGRATIONS_PATH } from '../migrations/migrationsScriptHandler';

import { AbstractDatabaseSetupStrategy } from './abstract';

/**
 * This strategy creates a single instance RDS Postgres database. This is a lightweight database setup intended for
 * use in ephemeral environments such as those used for development and testing. It is not intended for production use.
 */
export class RdsPgSingleInstanceSetupStrategy extends AbstractDatabaseSetupStrategy<RdsPgSingleInstanceDatabaseConfig> {
  public async setup(): Promise<IDatabase> {
    this.ensureAllowedStage();
    const egressSecurityGroup = this.createEgressSecurityGroup();
    const ingressSecurityGroup = this.createIngressSecurityGroup();
    this.configureSecurityGroupRules(egressSecurityGroup, ingressSecurityGroup);
    const databaseInstance = this.createInstance(ingressSecurityGroup);
    const databaseCredentialsSecret = this.getDatabaseCredentialsSecret(databaseInstance);
    const databaseConnectionConfig = this.createDatabaseConnectionConfig(databaseInstance, databaseCredentialsSecret);
    const migrationsScript = this.createMigrationsScript(
      databaseInstance,
      databaseConnectionConfig,
      databaseCredentialsSecret,
      egressSecurityGroup,
    );
    const awsDatabaseAdapter = this.createDatabaseAdapter(
      databaseInstance,
      databaseConnectionConfig,
      egressSecurityGroup,
      databaseCredentialsSecret,
    );
    this.seedStrategy.createSeedScript(awsDatabaseAdapter, migrationsScript);
    return awsDatabaseAdapter;
  }

  private ensureAllowedStage(): void {
    if (process.env.REDEMPTIONS_DANGEROUSLY_ALLOW_DATABASE_SETUP_STRATEGY === 'true') {
      return;
    }

    const disallowedStages = [STAGING_STAGE, PRODUCTION_STAGE];
    if (disallowedStages.includes(this.stack.stage)) {
      throw new Error(
        [
          `This database setup strategy is not allowed in the ${this.stack.stage} stage.`,
          'It is intended for use in ephemeral environments such as those used for development and testing.',
          'It is not intended for use in production or production-like environments (such as staging).',
          `The strategy is disallowed for these stages: ${disallowedStages.join(', ')}.`,
        ].join(' '),
      );
    }

    if (this.app.mode === 'dev') {
      this.logger.warn({
        message: [
          `Running "sst dev" is not recommended with RDS because RDS cannot be used with live lambda`,
          'It is recommended to use a local database instead of RDS. To use a local database, set the',
          `${EnvironmentKeys.REDEMPTIONS_DATABASE_TYPE} environment variable to ${DatabaseType.LOCAL}.`,
          'If you are certain you want to use an RDS database, set the environment variable',
          `${EnvironmentKeys.REDEMPTIONS_DANGEROUSLY_ALLOW_DATABASE_SETUP_STRATEGY} to true.`,
        ].join(' '),
      });
    }
  }

  private createEgressSecurityGroup(): DatabaseEgressSecurityGroup {
    const securityGroup = new SecurityGroup(this.stack, 'RedemptionsDatabaseEgressSecurityGroup', {
      vpc: this.vpc,
      description: 'Security Group for egress traffic to the Redemptions Database',
    });

    return DatabaseEgressSecurityGroup.of(securityGroup);
  }

  private createIngressSecurityGroup(): DatabaseIngressSecurityGroup {
    const securityGroup = new SecurityGroup(this.stack, 'RedemptionsDatabaseIngressSecurityGroup', {
      vpc: this.vpc,
      description: 'Security Group for allowing ingress traffic to the Redemptions Database',
      allowAllOutbound: false,
    });

    return DatabaseIngressSecurityGroup.of(securityGroup);
  }

  private configureSecurityGroupRules(
    egressSecurityGroup: DatabaseEgressSecurityGroup,
    ingressSecurityGroup: DatabaseIngressSecurityGroup,
  ): void {
    egressSecurityGroup.addEgressRule(
      ingressSecurityGroup,
      Port.tcp(this.config.port),
      'Allow outbound to Postgres from the ingress security group',
    );

    ingressSecurityGroup.addIngressRule(
      egressSecurityGroup,
      Port.tcp(this.config.port),
      'Allow inbound to Postgres from the egress security group',
    );
  }

  private createInstance(ingressSecurityGroup: DatabaseIngressSecurityGroup): DatabaseInstance {
    const databaseInstance = new DatabaseInstance(this.stack, 'RedemptionsDatabase', {
      engine: DatabaseInstanceEngine.postgres({
        // TODO: Use the latest version
        version: PostgresEngineVersion.VER_12,
      }),
      instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
      allocatedStorage: 20,
      multiAz: false,
      storageType: StorageType.GP2,
      databaseName: this.config.databaseName,
      vpc: this.vpc,
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE_ISOLATED,
      },
      securityGroups: [ingressSecurityGroup],
      backupRetention: Duration.days(0),
      enablePerformanceInsights: false,
      port: this.config.port,
    });

    return databaseInstance;
  }

  private getDatabaseCredentialsSecret(database: DatabaseInstance): ISecret {
    if (!database.secret) {
      throw new Error('The database secret was not found.');
    }
    return database.secret;
  }

  private createDatabaseConnectionConfig(
    database: DatabaseInstance,
    databaseCredentialsSecret: ISecret,
  ): DatabaseConnectionConfig {
    const connectionConfig = DatabaseConnectionConfig.fromCredentialsAndEndpoint(
      SecretsManagerDatabaseCredentials.fromSecretName(databaseCredentialsSecret.secretName),
      DatabaseEndpoint.fromHostAndPort(database.dbInstanceEndpointAddress, this.config.port),
      this.config.databaseName,
    );

    return connectionConfig;
  }

  private createMigrationsScript(
    database: DatabaseInstance,
    databaseConnectionConfig: DatabaseConnectionConfig,
    databaseCredentialsSecret: ISecret,
    egressSecurityGroup: DatabaseEgressSecurityGroup,
  ): Script {
    const migrations = new Function(this.stack, 'RedemptionsDatabaseMigrationsLambda', {
      handler: 'packages/api/redemptions/src/database/setup/migrations/migrationsScriptHandler.handler',
      enableLiveDev: false, // true is not allowed when applied to the Script construct.
      copyFiles: [{ from: 'packages/api/redemptions/src/database/migrations', to: MIGRATIONS_PATH }],
      functionName: `redemptions-database-migrations-${this.stack.stage}`,
      vpc: this.vpc,
      vpcSubnets: {
        // Egress is required to connect to the secrets manager endpoint
        subnetType: SubnetType.PRIVATE_WITH_EGRESS,
      },
      securityGroups: [egressSecurityGroup],
      environment: databaseConnectionConfig.toEnvironmentVariables(),
    });

    migrations.node.addDependency(database);

    const grantDatabaseConnect = database.grantConnect(migrations);

    const grantDatabaseCredentialsSecretRead = databaseCredentialsSecret.grantRead(migrations);

    const migrationScript = new Script(this.stack, 'DatabaseMigrationLambdas', {
      onCreate: migrations,
      onUpdate: migrations,
    });

    migrationScript.node.addDependency(grantDatabaseConnect, grantDatabaseCredentialsSecretRead);

    return migrationScript;
  }

  private createDatabaseAdapter(
    database: DatabaseInstance,
    connectionConfig: DatabaseConnectionConfig,
    egressSecurityGroup: DatabaseEgressSecurityGroup,
    databaseCredentialsSecret: ISecret,
  ): IDatabase {
    return {
      connectionConfig,
      egressSecurityGroup,
      grantCredentialsSecretRead: (lambda) => databaseCredentialsSecret.grantRead(lambda),
      grantConnect: (lambda) => database.grantConnect(lambda),
      getFunctionProps: (props) => ({
        ...props,
        enableLiveDev: false,
        vpc: this.vpc,
        vpcSubnets: {
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
          ...props.vpcSubnets,
        },
        securityGroups: [egressSecurityGroup, ...(props.securityGroups ?? [])],
        environment: {
          ...connectionConfig.toEnvironmentVariables(),
          ...props.environment,
        },
      }),
    };
  }
}
