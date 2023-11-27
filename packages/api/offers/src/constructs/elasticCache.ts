import { Stack } from 'aws-cdk-lib';
import { Port, SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';
import { CfnReplicationGroup, CfnSubnetGroup } from 'aws-cdk-lib/aws-elasticache';
import { ManagedPolicy, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { isDev, isProduction } from '../../../core/src/utils/checkEnvironment';
import { CfnScalableTarget, CfnScalingPolicy, PredefinedMetric } from 'aws-cdk-lib/aws-applicationautoscaling';

export class ElasticCache {
  redisReplicationGroup!: CfnReplicationGroup;
  securityGroup!: SecurityGroup;
  cacheSubnetGroup!: CfnSubnetGroup;
  vpc!: Vpc;
  lambdaRole!: Role;
  private autoScalingRole!: Role;
  private scalableTarget!: CfnScalableTarget;

  constructor(private readonly stack: Stack, private readonly stage: string) {
    if (!isDev(stage)) {
      this.vpc = this.createVPC();
      this.securityGroup = this.createSecurityGroup();
      this.createSubnets();
      this.lambdaRole = this.createRole();
      this.redisReplicationGroup = this.createRedisReplicationGroup();
      this.autoScalingRole = this.createAutoScalingRole();
      this.scalableTarget = this.createScalableTarget();
      this.createScalingPolicy();
    }
  }

  private createRedisReplicationGroup() {
    return new CfnReplicationGroup(this.stack, `${this.stage}-offers-redis-rg`, {
      cacheNodeType: isProduction(this.stage) ? 'cache.m6g.xlarge' : 'cache.m6g.large',
      replicationGroupId: `${this.stage}-offers-redis-rg`,
      engine: 'redis',
      autoMinorVersionUpgrade: true,
      numNodeGroups: 1,
      replicasPerNodeGroup: 2,
      automaticFailoverEnabled: true,
      cacheSubnetGroupName: this.cacheSubnetGroup.ref,
      securityGroupIds: [this.securityGroup.securityGroupId],
      replicationGroupDescription: `${this.stage}-Offers-Redis-Replication-Group`,
      cacheParameterGroupName: 'default.redis7.cluster.on',
    });
  }

  private createVPC() {
    return new Vpc(this.stack, `${this.stage}-OfferCacheVPC`, {
      maxAzs: 2,
      natGateways: 1,
    });
  }

  private createSecurityGroup() {
    const sg = new SecurityGroup(this.stack, `${this.stage}-OfferCacheSecurityGroup`, {
      vpc: this.vpc,
      description: 'Allow Redis Traffic',
      allowAllOutbound: true,
    });
    sg.addIngressRule(sg, Port.tcp(6379));
    return sg;
  }

  private createSubnets() {
    this.cacheSubnetGroup = new CfnSubnetGroup(this.stack, `${this.stage}-OfferCacheSubnetGroup`, {
      description: 'Subnet group for Redis Cluster',
      subnetIds: this.vpc.privateSubnets.map((subnet) => subnet.subnetId),
    });
  }

  private createRole() {
    return new Role(this.stack, `${this.stage}-OfferCacheRole`, {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaVPCAccessExecutionRole'),
      ],
    });
  }

  private createAutoScalingRole() {
    const role = new Role(this.stack, `${this.stage}-AutoScalingRole`, {
      assumedBy: new ServicePrincipal('application-autoscaling.amazonaws.com'),
    });
    role.addToPolicy(
      new PolicyStatement({
        actions: ['elasticache:DescribeCacheClusters', 'elasticache:ModifyReplicationGroup'],
        resources: [
          `arn:aws:elasticache:${this.stack.region}:${this.stack.account}:cluster:${this.redisReplicationGroup.ref}`,
        ],
      }),
    );

    return role;
  }

  private createScalableTarget() {
    return new CfnScalableTarget(this.stack, `${this.stage}-ScalableTarget`, {
      maxCapacity: 10,
      minCapacity: 2,
      resourceId: `replication-group/${this.redisReplicationGroup.ref}`,
      roleArn: this.autoScalingRole.roleArn,
      scalableDimension: 'elasticache:replication-group:NodeGroups',
      serviceNamespace: 'elasticache',
    });
  }

  private createScalingPolicy() {
    return new CfnScalingPolicy(this.stack, `${this.stage}-Offers-ScalingPolicy`, {
      policyName: `${this.stage}-Offers-TargetTrackingScalingPolicy`,
      policyType: 'TargetTrackingScaling',
      scalingTargetId: this.scalableTarget.ref,
      targetTrackingScalingPolicyConfiguration: {
        targetValue: 70,
        predefinedMetricSpecification: {
          predefinedMetricType: PredefinedMetric.ELASTICACHE_PRIMARY_ENGINE_CPU_UTILIZATION,
        },
      },
    });
  }
}
