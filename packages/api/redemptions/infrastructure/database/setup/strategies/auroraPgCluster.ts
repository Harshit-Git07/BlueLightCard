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

import { isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';
import {
  DatabaseConnectionConfig,
  DatabaseEndpoint,
  SecretsManagerDatabaseCredentials,
} from '@blc-mono/redemptions/libs/database/connection';

import { AuroraPgClusterDatabaseConfig } from '../../../config/database';
import { RedemptionsStackEnvironmentKeys } from '../../../constants/environment';
import { IDatabase } from '../../adapter';
import {
  BastionHostDefaultSecurityGroup,
  DatabaseEgressSecurityGroup,
  DatabaseIngressSecurityGroup,
} from '../../types';
import { MIGRATIONS_PATH } from '../migrations/migrationsScriptHandler';

import { AbstractDatabaseSetupStrategy } from './abstract';

export class AuroraPgClusterSetupStrategy extends AbstractDatabaseSetupStrategy<AuroraPgClusterDatabaseConfig> {
  public setup(): Promise<IDatabase> {
    this.ensureAllowedStage();
    const egressSecurityGroup = this.createEgressSecurityGroup();
    const ingressSecurityGroup = this.createIngressSecurityGroup();
    const bastionHostDefaultSecurityGroup = this.getBastionHostDefaultSecurityGroup();
    this.configureSecurityGroupRules(egressSecurityGroup, ingressSecurityGroup, bastionHostDefaultSecurityGroup);
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
    return Promise.resolve(awsDatabaseAdapter);
  }

  private ensureAllowedStage(): void {
    // Make sure the user has explicitly opted in to using this strategy if they are using it in an environment other
    // than development or staging. It may be used in other environments to debug issues, but it should not be used
    // by default because it is expensive and slow to create.
    if (process.env.REDEMPTIONS_DANGEROUSLY_ALLOW_DATABASE_SETUP_STRATEGY === 'true') {
      return;
    }

    const allowedStage = isProduction(this.stack.stage) || isStaging(this.stack.stage);
    if (!allowedStage) {
      throw new Error(
        [
          `This database strategy is only intended for use in production and production-like environments (such as staging).`,
          'This is because it is expensive to run and slow to create. If you are certain you want to use this strategy,',
          `set the environment variable ${RedemptionsStackEnvironmentKeys.REDEMPTIONS_DANGEROUSLY_ALLOW_DATABASE_SETUP_STRATEGY} to true.`,
          `By default, the strategy is allowed for production and staging environments.`,
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
    bastionHostDefaultSecurityGroup: BastionHostDefaultSecurityGroup | undefined,
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

    if (bastionHostDefaultSecurityGroup) {
      ingressSecurityGroup.addIngressRule(
        bastionHostDefaultSecurityGroup,
        Port.tcp(this.config.port),
        'Allow inbound to Postgres from the bastion host default security group',
      );

      bastionHostDefaultSecurityGroup?.addEgressRule(
        ingressSecurityGroup,
        Port.tcp(this.config.port),
        'Allow outbound to Postgres from the ingress security group',
      );
    }
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

    /**
     * TODO(TR-448): Replace this with AuroraPostgresEngineVersion.VER_15_5
     *
     * @see https://github.com/aws/aws-cdk/blob/91246acde1ab0512ea6b375f66c283516cb6f2b0/packages/aws-cdk-lib/aws-rds/lib/cluster-engine.ts#L968C37-L968C117
     */
    const version = AuroraPostgresEngineVersion.of('15.5', '15', { s3Import: true, s3Export: true });

    // TODO: Look into storage encryption
    // TODO: Configure backups
    const databaseCluster = new DatabaseCluster(this.stack, `RedemptionsDatabase`, {
      engine: DatabaseClusterEngine.auroraPostgres({ version }),
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

    this.stack.addOutputs({
      redemptionsDatabaseReaderInstanceEndpointHostname: databaseCluster.clusterReadEndpoint.hostname,
      redemptionsDatabaseReaderInstanceEndpointPort: databaseCluster.clusterReadEndpoint.port.toString(),
      redemptionsDatabaseWriterInstanceEndpointHostname: databaseCluster.clusterEndpoint.hostname,
      redemptionsDatabaseWriterInstanceEndpointPort: databaseCluster.clusterEndpoint.port.toString(),
    });

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
      handler: 'packages/api/redemptions/infrastructure/database/setup/migrations/migrationsScriptHandler.handler',
      enableLiveDev: false, // true is not allowed when applied to the Script construct.
      copyFiles: [{ from: 'packages/api/redemptions/infrastructure/database/migrations', to: MIGRATIONS_PATH }],
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
      grantConnect: (lambda) => {
        return [databaseCredentialsSecret.grantRead(lambda)];
      },
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
