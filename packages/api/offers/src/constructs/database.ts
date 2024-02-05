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
import { isDev } from '../../../core/src/utils/checkEnvironment';
import { SecretManager } from './secret-manager';
import { SecurityGroupManager } from './security-group-manager';
import { EC2Manager } from './ec2-manager';
import { DATABASE_PROPS } from '../utils/global-constants';

/**
 * Manages the creation and configuration of database resources, including Aurora Serverless V2 clusters,
 * RDS Proxies, and development database instances, based on the application's environment.
 */
export class Database {
  private readonly _database: DatabaseInstance | DatabaseCluster | undefined;
  private readonly _rdsProxy: DatabaseProxy | undefined;

  constructor(
    private stack: Stack,
    private iVpc: IVpc,
    private secretManager: SecretManager,
    private securityGroupManager: SecurityGroupManager,
    private ec2Manager: EC2Manager,
  ) {
    if (isDev(this.stack.stage)) {
      //  this._database = this.createLocalDevelopmentDatabase();
    } else {
      this._database = this.createAuroraServerlessV2();
      this._rdsProxy = this.createProxy();
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
  get database(): DatabaseInstance | DatabaseCluster | undefined {
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
      instanceIdentifier: `${this.stack.stage}-offers-database-writer`,
      autoMinorVersionUpgrade: true,
      scaleWithWriter: true,
    });
    // Create Reader instances
    const readerInstances: IClusterInstance[] = [
      ClusterInstance.serverlessV2('Reader', {
        instanceIdentifier: `${this.stack.stage}-offers-database-reader-1`,
        autoMinorVersionUpgrade: true,
        scaleWithWriter: true,
      }),
    ];

    // Create cluster
    const cluster = new DatabaseCluster(this.stack, 'ServerlessDatabase', {
      clusterIdentifier: `${this.stack.stage}-offers-database-cluster`,
      engine: DatabaseClusterEngine.auroraMysql({ version: AuroraMysqlEngineVersion.VER_3_05_0 }),
      writer: writerInstance,
      readers: readerInstances,
      credentials: Credentials.fromSecret(this.secretManager.databaseSecret),
      serverlessV2MinCapacity: 0.5,
      serverlessV2MaxCapacity: 128,
      vpc: this.iVpc,
      defaultDatabaseName: DATABASE_PROPS.NAME.valueOf(),
      port: DATABASE_PROPS.PORT.valueOf(),
      securityGroups: [this.securityGroupManager.auroraServerlessV2SecurityGroup!],
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

    if (this.database instanceof DatabaseInstance) {
      throw new Error('Cannot create proxy for DatabaseInstance');
    }

    // Create proxy
    return new DatabaseProxy(this.stack, 'OffersDataBaseProxy', {
      dbProxyName: `${this.stack.stage}-offers-database-proxy`,
      proxyTarget: ProxyTarget.fromCluster(this.database),
      secrets: [this.database.secret!],
      vpc: this.iVpc,
      securityGroups: [this.securityGroupManager.auroraServerlessV2SecurityGroup!],
    });
  }

  /**
   * Creates a local MySQL database instance for development purposes, making it publicly accessible
   * for easier local development and testing.
   *
   * @return {DatabaseInstance} the database instance
   */
  private createLocalDevelopmentDatabase(): DatabaseInstance {
    return new DatabaseInstance(this.stack, 'LocalDevelopmentDB', {
      instanceIdentifier: `${this.stack.stage}-offers-local-dev-db`,
      engine: DatabaseInstanceEngine.mysql({ version: MysqlEngineVersion.VER_8_0_32 }),
      instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.MICRO),
      credentials: Credentials.fromSecret(this.secretManager.databaseSecret),
      vpc: this.iVpc,
      publiclyAccessible: true,
      databaseName: DATABASE_PROPS.NAME.valueOf(),
      port: DATABASE_PROPS.PORT.valueOf(),
      autoMinorVersionUpgrade: true,
      enablePerformanceInsights: false,
      securityGroups: [this.securityGroupManager.developmentDatabaseSecurityGroup!],
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
