import { Stack } from "aws-cdk-lib";
import { Port, SecurityGroup, Vpc } from "aws-cdk-lib/aws-ec2";
import { CfnCacheCluster, CfnSubnetGroup } from "aws-cdk-lib/aws-elasticache";
import { ManagedPolicy, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { isDev, isProduction } from '../../../core/src/utils/checkEnvironment';

export class ElasticCache {

  // @ts-ignore
  redisCluster: CfnCacheCluster;

  // @ts-ignore
  securityGroup: SecurityGroup;

  // @ts-ignore
  cacheSubnetGroup: CfnSubnetGroup;

  // @ts-ignore
  vpc: Vpc;

  // @ts-ignore
  lambdaRole: Role;

  constructor(private readonly stack: Stack, private readonly stage: string) {
    if (!isDev(stage)) {
      this.vpc = this.createVPC();
      this.securityGroup = this.createSecurityGroup();
      this.createSubnets();
      this.lambdaRole = this.createRole();
      this.redisCluster = this.createRedisCluster();
    }
  }

  private createRedisCluster() {
    if (this.securityGroup === undefined) {
      throw new Error("Security Group is undefined")
    }
    return new CfnCacheCluster(this.stack, `${this.stage}-OfferRedisCluster`, {
      cacheNodeType: isProduction(this.stage) ? "cache.m6g.large" : "cache.t4g.micro",
      engine: "redis",
      numCacheNodes: 1,
      clusterName: `${this.stage}-OfferRedisCluster`,
      cacheSubnetGroupName: this.cacheSubnetGroup?.ref,
      vpcSecurityGroupIds: [this.securityGroup.securityGroupId],
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
      description: "Allow Redis Traffic",
      allowAllOutbound: true,
    });
    sg.addIngressRule(sg, Port.tcp(6379));
    return sg;
  }

  private createSubnets() {
    this.cacheSubnetGroup = new CfnSubnetGroup(this.stack, `${this.stage}-OfferCacheSubnetGroup`, {
      description: "Subnet group for Redis Cluster",
      subnetIds: this.vpc.privateSubnets.map(subnet => subnet.subnetId),
    });
  }

  private createRole() {
    return new Role(this.stack, `${this.stage}-OfferCacheRole`, {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
        ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaVPCAccessExecutionRole'),
      ]
    });
  }

}
