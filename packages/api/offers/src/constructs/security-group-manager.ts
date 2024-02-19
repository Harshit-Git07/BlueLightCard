import { Stack } from 'sst/constructs';
import { IVpc, Peer, Port, SecurityGroup } from 'aws-cdk-lib/aws-ec2';
import { DATABASE_PROPS, ENVIRONMENTS, EPHEMERAL_PR_REGEX } from '../utils/global-constants';
import { isDev } from '../../../core/src/utils/checkEnvironment';

/**
 * Defines the interface for managing various security groups within the application.
 */
export interface ISecurityGroupManager {
  get auroraServerlessV2SecurityGroup(): SecurityGroup | undefined;
  get bastionHostSecurityGroup(): SecurityGroup | undefined;
  get prDatabaseSecurityGroup(): SecurityGroup | undefined;
  get lambdaToRdsProxySecurityGroup(): SecurityGroup | undefined;
}

/**
 * Implements a singleton pattern to manage and provide access to different security groups
 * needed across the application, ensuring that security groups are created once and reused
 * wherever necessary.
 */
export class SecurityGroupManager implements ISecurityGroupManager {
  private readonly _auroraServerlessV2SG: SecurityGroup | undefined;
  private readonly _bastionHostSG: SecurityGroup | undefined;
  private readonly _prDatabaseSG: SecurityGroup | undefined;
  private readonly _lambdaToRdsProxySG: SecurityGroup | undefined;

  /**
   * The constructor is private to prevent direct construction calls with the `new` operator.
   */
  constructor(private stack: Stack, private vpc: IVpc) {
    if ([ENVIRONMENTS.PRODUCTION.valueOf(), ENVIRONMENTS.STAGING.valueOf()].includes(this.stack.stage)) {
      this._lambdaToRdsProxySG = this.createLambdaToRdsProxySecurityGroup();
      this._auroraServerlessV2SG = this.createAuroraServerlessV2SecurityGroup();
      this._bastionHostSG = this.createBastionHostSecurityGroup();
    } else if (EPHEMERAL_PR_REGEX.test(this.stack.stage)) {
      this._prDatabaseSG = this.createPrDatabaseSecurityGroup();
    }
  }

  /**
   * Get the Aurora Serverless V2 security group.
   * @return {SecurityGroup} the Aurora Serverless V2 security group
   */
  get auroraServerlessV2SecurityGroup(): SecurityGroup | undefined {
    return this._auroraServerlessV2SG;
  }

  /**
   * Get the bastion host security group.
   * @return {SecurityGroup} the bastion host security group
   */
  get bastionHostSecurityGroup(): SecurityGroup | undefined {
    return this._bastionHostSG;
  }

  /**
   * Get the PR database security group.
   * @return {SecurityGroup} the PR database security group
   */
  get prDatabaseSecurityGroup(): SecurityGroup | undefined {
    return this._prDatabaseSG;
  }

  /**
   * Get the Lambda to RDS Proxy security group.
   * @return {SecurityGroup} the Lambda to RDS Proxy security group
   */
  get lambdaToRdsProxySecurityGroup(): SecurityGroup | undefined {
    return this._lambdaToRdsProxySG;
  }

  /**
   * Creates and configures the security group for Aurora Serverless V2, allowing
   * MySQL traffic within the VPC and from the Lambda to RDS Proxy connection.
   * @return {SecurityGroup} the Aurora Serverless V2 security group
   */
  private createAuroraServerlessV2SecurityGroup(): SecurityGroup {
    const sg: SecurityGroup = this.builder('AuroraServerlessV2SG', 'Allow MySQL Traffic');
    sg.addIngressRule(sg, Port.tcp(DATABASE_PROPS.PORT.valueOf()), 'Allow MySQL Port 3306 from within the VPC');
    sg.addIngressRule(
      this.lambdaToRdsProxySecurityGroup!,
      Port.tcp(DATABASE_PROPS.PORT.valueOf()),
      'Allow Lambda to RDS Proxy Connection',
    );
    return sg;
  }

  /**
   * Creates a PR database security group that allows MySQL access from any IPv4 or IPv6 address.
   * @return {SecurityGroup} the PR database security group
   */
  private createPrDatabaseSecurityGroup(): SecurityGroup {
    const sg: SecurityGroup = this.builder('PrDatabaseSG', 'Allow MySQL access from local machine');
    sg.addIngressRule(Peer.anyIpv4(), Port.tcp(DATABASE_PROPS.PORT.valueOf()), 'Allow MySQL Port 3306 from Any IPv4');
    sg.addIngressRule(Peer.anyIpv6(), Port.tcp(DATABASE_PROPS.PORT.valueOf()), 'Allow MySQL Port 3306 from Any IPv6');
    return sg;
  }

  /**
   * Establishes a bastion host security group to allow SSH traffic, enabling secure
   * access to instances within the VPC.
   * @return {SecurityGroup} the bastion host security group
   */
  private createBastionHostSecurityGroup(): SecurityGroup {
    const sg: SecurityGroup = this.builder('BastionHostSG', 'Allow SSH Traffic');
    sg.addIngressRule(sg, Port.tcp(22), 'Allow SSH Port 22');
    return sg;
  }

  /**
   * Prepares a security group to allow Lambda functions to connect to the RDS Proxy,
   * facilitating secure database interactions from serverless functions.
   * @return {SecurityGroup} the Lambda to RDS Proxy security group
   */
  private createLambdaToRdsProxySecurityGroup(): SecurityGroup {
    return this.builder('LambdaToRdsSG', 'Allow Lambda to Rds Proxy Connection');
  }

  /**
   * A helper method to streamline the creation of security groups with common properties.
   * @param {string} id the id of the security group
   * @param {string} description the description of the security group
   * @return {SecurityGroup} the created security group
   */
  private builder(id: string, description: string): SecurityGroup {
    return new SecurityGroup(this.stack, id, {
      vpc: this.vpc,
      description: `${description}`,
      allowAllOutbound: true,
    });
  }
}
