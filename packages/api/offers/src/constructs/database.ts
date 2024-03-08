import { Stack } from 'sst/constructs';
import { InstanceClass, InstanceSize, InstanceType, IVpc, Port, SubnetType } from 'aws-cdk-lib/aws-ec2';
import {
  AuroraMysqlEngineVersion,
  ClusterInstance,
  Credentials,
  DatabaseCluster,
  DatabaseClusterEngine,
  DatabaseInstance,
  DatabaseInstanceEngine,
  DatabaseProxy,
  IClusterInstance,
  MysqlEngineVersion,
  ProxyTarget,
  StorageType,
} from 'aws-cdk-lib/aws-rds';
import { Duration, RemovalPolicy } from 'aws-cdk-lib';
import { SecretManager } from './secret-manager';
import { SecurityGroupManager } from './security-group-manager';
import { EC2Manager } from './ec2-manager';
import { DATABASE_PROPS, ENVIRONMENTS, EPHEMERAL_PR_REGEX } from '../utils/global-constants';
import { DatabaseResource, DatabaseType } from '../database/type';
import { isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';

/**
 * Manages the creation and configuration of database resources, including Aurora Serverless V2 clusters,
 * RDS Proxies, and development database instances, based on the application's environment.
 */
export class Database {
  private readonly _database: DatabaseResource;
  private readonly _rdsProxy: DatabaseProxy | undefined;

  constructor(
    private stack: Stack,
    private iVpc: IVpc,
    private secretManager: SecretManager,
    private securityGroupManager: SecurityGroupManager,
    private ec2Manager: EC2Manager,
  ) {
    this._database = this.initDatabase();
  }

  private initDatabase(): DatabaseResource {
    const stage = this.stack.stage;
    if (isStaging(stage)) {
      // Todo: add isProduction when everything works on Staging
      return this.createAuroraServerlessV2();
    } else if (EPHEMERAL_PR_REGEX.test(stage)) {
      return this.createEphemeralDatabase();
    } else {
      return DatabaseType.LOCAL;
    }
  }

  /**
   * Get the database proxy.
   *
   * @return {DatabaseProxy} the database proxy
   */
  get rdsProxy(): DatabaseProxy | undefined {
    return this._rdsProxy;
  }

  /**
   * Get the database instance or cluster.
   *
   * @return {DatabaseInstance | DatabaseCluster} the database instance or cluster
   */
  get database(): DatabaseResource {
    return this._database;
  }

  /**
   * Creates an Aurora Serverless V2 database cluster, including writer and reader instances,
   * and configures it with the appropriate security groups and credentials.
   *
   * @return {DatabaseCluster} the database cluster
   */
  private createAuroraServerlessV2(): DatabaseCluster {
    // Pre-condition check
    if (!this.ec2Manager.bastionHost) {
      throw new Error(
        [
          'Bastion Host is not defined.',
          'You need to create a bastion host first before creating aurora serverless v2.',
          'Otherwise, you will not be able to connect to the database.',
        ].join('\n'),
      );
    }

    // Create Writer instance
    const writerInstance: IClusterInstance = ClusterInstance.serverlessV2('Writer', {
      autoMinorVersionUpgrade: true,
      scaleWithWriter: true,
    });
    // Create Reader instances
    const readerInstances: IClusterInstance[] = [
      ClusterInstance.serverlessV2('Reader', {
        autoMinorVersionUpgrade: true,
        scaleWithWriter: true,
      }),
    ];

    // Create cluster
    const cluster = new DatabaseCluster(this.stack, 'ServerlessDatabaseOffers', {
      clusterIdentifier: `offers-database-cluster-${this.stack.stage}`,
      engine: DatabaseClusterEngine.auroraMysql({
        version: AuroraMysqlEngineVersion.of('8.0.mysql_aurora.3.05.2', '8.0'),
      }),
      writer: writerInstance,
      readers: readerInstances,
      credentials: Credentials.fromSecret(this.secretManager.databaseSecret),
      serverlessV2MinCapacity: 0.5,
      serverlessV2MaxCapacity: 128,
      vpc: this.iVpc,
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE_ISOLATED,
      },
      defaultDatabaseName: DATABASE_PROPS.NAME.valueOf(),
      port: DATABASE_PROPS.PORT.valueOf(),
      securityGroups: [this.securityGroupManager.auroraServerlessV2SecurityGroup!],
      removalPolicy: RemovalPolicy.RETAIN,
    });

    // Allow connections from bastion host
    cluster.connections.allowDefaultPortFrom(this.ec2Manager.bastionHost);
    // Allow connections from Security group
    cluster.connections.allowFrom(
      this.securityGroupManager.auroraServerlessV2SecurityGroup!,
      Port.tcp(DATABASE_PROPS.PORT.valueOf()),
    );
    return cluster;
  }

  /**
   * Creates an RDS Proxy for the Aurora Serverless V2 database cluster, enabling
   * efficient database access and connection pooling.
   *
   * @return {DatabaseProxy} the database proxy
   */
  private createProxy(): DatabaseProxy {
    // Pre-condition check
    if (!this.database) {
      throw new Error('Database is not defined. You need to create a database first before creating proxy.');
    }

    if (this.database instanceof DatabaseCluster) {
      // Create proxy
      return new DatabaseProxy(this.stack, 'OffersDataBaseProxy', {
        dbProxyName: `${this.stack.stage}-offers-database-proxy`,
        proxyTarget: ProxyTarget.fromCluster(this.database),
        secrets: [this.database.secret!],
        vpc: this.iVpc,
        securityGroups: [this.securityGroupManager.auroraServerlessV2SecurityGroup!],
      });
    } else {
      throw new Error('Database is not defined. You need to create a database cluster first before creating proxy.');
    }
  }

  /**
   * Creates a Ephemeral MySQL database instance for PR, making it publicly accessible
   * for easier access and testing.
   *
   * @return {DatabaseInstance} the database instance
   */
  private createEphemeralDatabase(): DatabaseInstance {
    return new DatabaseInstance(this.stack, 'EphemeralDB', {
      instanceIdentifier: `${this.stack.stage}-offers-ephemeral-db`,
      engine: DatabaseInstanceEngine.mysql({ version: MysqlEngineVersion.VER_8_0_32 }),
      instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.MICRO),
      credentials: Credentials.fromSecret(this.secretManager.databaseSecret),
      vpc: this.iVpc,
      publiclyAccessible: true,
      databaseName: DATABASE_PROPS.NAME.valueOf(),
      port: DATABASE_PROPS.PORT.valueOf(),
      autoMinorVersionUpgrade: true,
      enablePerformanceInsights: false,
      securityGroups: [this.securityGroupManager.ephemeralDatabaseSecurityGroup!],
      multiAz: false,
      deletionProtection: false,
      storageType: StorageType.GP2,
      backupRetention: Duration.days(0),
      vpcSubnets: {
        subnetType: SubnetType.PUBLIC,
      },
      removalPolicy: RemovalPolicy.DESTROY,
    });
  }
}
