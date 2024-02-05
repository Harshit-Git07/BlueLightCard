import { RemovalPolicy } from 'aws-cdk-lib';
import { Port, SecurityGroup, SubnetType } from 'aws-cdk-lib/aws-ec2';
import {
  AuroraPostgresEngineVersion,
  ClusterInstance,
  DatabaseCluster,
  DatabaseClusterEngine,
} from 'aws-cdk-lib/aws-rds';
import { ISecret } from 'aws-cdk-lib/aws-secretsmanager';
import { Function, Script } from 'sst/constructs';

import { AuroraPgClusterDatabaseConfig } from '../../../config/database';
import { EnvironmentKeys } from '../../../constants/environment';
import { PRODUCTION_STAGE, STAGING_STAGE } from '../../../constants/sst';
import { IDatabase } from '../../adapter';
import { DatabaseConnectionConfig, DatabaseEndpoint, SecretsManagerDatabaseCredentials } from '../../connection';
import { DatabaseEgressSecurityGroup, DatabaseIngressSecurityGroup } from '../../types';
import { MIGRATIONS_PATH } from '../migrations/migrationsScriptHandler';

import { AbstractDatabaseSetupStrategy } from './abstract';

export class AuroraPgClusterSetupStrategy extends AbstractDatabaseSetupStrategy<AuroraPgClusterDatabaseConfig> {
  public async setup(): Promise<IDatabase> {
    this.ensureAllowedStage();
    const egressSecurityGroup = this.createEgressSecurityGroup();
    const ingressSecurityGroup = this.createIngressSecurityGroup();
    this.configureSecurityGroupRules(egressSecurityGroup, ingressSecurityGroup);
    const databaseCluster = this.createDatabaseCluster(ingressSecurityGroup);
    // TODO: Add a secret rotation schedule
    // TODO: Create RDS proxy
    const databaseCredentialsSecret = this.getDatabaseCredentialsSecret(databaseCluster);
    const databaseConnectionConfig = this.createDatabaseConnectionConfig(databaseCluster, databaseCredentialsSecret);
    const migrationsScript = this.createMigrationsScript(
      databaseCluster,
      databaseConnectionConfig,
      databaseCredentialsSecret,
      egressSecurityGroup,
    );
    const awsDatabaseAdapter = this.createDatabaseAdapter(
      databaseConnectionConfig,
      egressSecurityGroup,
      databaseCredentialsSecret,
    );
    this.seedStrategy.createSeedScript(awsDatabaseAdapter, migrationsScript);
    return awsDatabaseAdapter;
  }

  private ensureAllowedStage(): void {
    // Make sure the user has explicitly opted in to using this strategy if they are using it in an environment other
    // than development or staging. It may be used in other environments to debug issues, but it should not be used
    // by default because it is expensive and slow to create.
    if (process.env.REDEMPTIONS_DANGEROUSLY_ALLOW_DATABASE_SETUP_STRATEGY === 'true') {
      return;
    }

    const allowedStages = [STAGING_STAGE, PRODUCTION_STAGE];
    if (!allowedStages.includes(this.stack.stage) || this.app.mode == 'dev') {
      throw new Error(
        [
          `This database strategy is only intended for use in production and production-like environments (such as staging).`,
          'This is because it is expensive to run and slow to create. If you are certain you want to use this strategy,',
          `set the environment variable ${EnvironmentKeys.REDEMPTIONS_DANGEROUSLY_ALLOW_DATABASE_SETUP_STRATEGY} to true.`,
          `By default, the strategy is allowed for these stages: ${allowedStages.join(', ')}.`,
        ].join(' '),
      );
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

  private createDatabaseCluster(ingressSecurityGroup: DatabaseIngressSecurityGroup): DatabaseCluster {
    const writer = ClusterInstance.serverlessV2(`redemptions-db-writer-${this.stack.stage}`, {
      autoMinorVersionUpgrade: true,
      scaleWithWriter: true,
    });

    const reader = ClusterInstance.serverlessV2(`redemptions-db-reader-${this.stack.stage}`, {
      autoMinorVersionUpgrade: true,
      scaleWithWriter: true,
    });

    // TODO: Look into storage encryption
    // TODO: Configure backups
    const databaseCluster = new DatabaseCluster(this.stack, `RedemptionsDatabase`, {
      engine: DatabaseClusterEngine.auroraPostgres({ version: AuroraPostgresEngineVersion.VER_15_2 }),
      writer,
      readers: [reader],
      serverlessV2MinCapacity: 0.5,
      serverlessV2MaxCapacity: 128,
      vpc: this.vpc,
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE_ISOLATED,
      },
      securityGroups: [ingressSecurityGroup],
      defaultDatabaseName: this.config.databaseName,
      removalPolicy: RemovalPolicy.RETAIN,
      port: this.config.port,
      clusterIdentifier: `redemptions-db-cluster-${this.stack.stage}`,
      // TODO: Enable IAM authentication
    });

    if (this.app.mode === 'remove') {
      this.logger.warn({
        message: [
          "The database cluster is configured with the removal policy 'RETAIN'.",
          'This means that it will not be removed and you will need to manually delete it.',
        ].join(' '),
      });
    }

    return databaseCluster;
  }

  private getDatabaseCredentialsSecret(database: DatabaseCluster): ISecret {
    if (!database.secret) {
      throw new Error('The database secret was not found.');
    }
    return database.secret;
  }

  private createDatabaseConnectionConfig(
    database: DatabaseCluster,
    databaseCredentialsSecret: ISecret,
  ): DatabaseConnectionConfig {
    const connectionConfig = DatabaseConnectionConfig.fromCredentialsAndEndpoint(
      SecretsManagerDatabaseCredentials.fromSecretName(databaseCredentialsSecret.secretName),
      DatabaseEndpoint.fromHostsAndPort(
        database.clusterReadEndpoint.hostname,
        database.clusterEndpoint.hostname,
        this.config.port,
      ),
      this.config.databaseName,
    );

    return connectionConfig;
  }

  private createMigrationsScript(
    database: DatabaseCluster,
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

    const grantDatabaseCredentialsSecretRead = databaseCredentialsSecret.grantRead(migrations);

    // TODO: Once database is created in production, migrations probably need to run before
    const migrationScript = new Script(this.stack, 'DatabaseMigrationLambdas', {
      onCreate: migrations,
      onUpdate: migrations,
    });

    migrationScript.node.addDependency(grantDatabaseCredentialsSecretRead);

    return migrationScript;
  }

  private createDatabaseAdapter(
    connectionConfig: DatabaseConnectionConfig,
    egressSecurityGroup: DatabaseEgressSecurityGroup,
    databaseCredentialsSecret: ISecret,
  ): IDatabase {
    return {
      connectionConfig,
      egressSecurityGroup,
      grantCredentialsSecretRead: (lambda) => databaseCredentialsSecret.grantRead(lambda),
      grantConnect: () => null,
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
