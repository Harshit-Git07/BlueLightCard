import {
  BastionHostLinux,
  Instance,
  InstanceClass,
  InstanceSize,
  InstanceType,
  IVpc,
  Peer,
  SubnetType,
} from 'aws-cdk-lib/aws-ec2';
import { Stack } from 'sst/constructs';
import { ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { SecurityGroupManager } from './security-group-manager';
import { isDev } from '../../../core/src/utils/checkEnvironment';

/**
 * The IEC2 interface provides a centralized way to manage all EC2 instances for the application.
 */
export interface IEC2 {
  get bastionHost(): BastionHostLinux | undefined;
}

/**
 * The EC2Manager class provides a centralized way to manage all EC2 instances for the application.
 * This class is a singleton. Use the getInstance() method to get the instance.
 */
export class EC2Manager implements IEC2 {
  private readonly _bastionHost: BastionHostLinux | undefined;

  constructor(private stack: Stack, private vpc: IVpc, private securityGroups: SecurityGroupManager) {
    if (!isDev(this.stack.stage)) {
      this._bastionHost = this.createBastionHost();
    }
  }

  /**
   * Gets the bastion host instance.
   *
   * @returns {BastionHostLinux} the bastion host instance
   */
  get bastionHost(): BastionHostLinux | undefined {
    return this._bastionHost;
  }

  /**
   * Creates the bastion host instance.
   *
   * @returns {BastionHostLinux} the bastion host instance
   */
  private createBastionHost(): BastionHostLinux {
    const host = new BastionHostLinux(this.stack, 'bastion-host', {
      instanceName: `${this.stack.stage}-bastion-host-offers`,
      vpc: this.vpc,
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.SMALL),
      subnetSelection: {
        subnetType: SubnetType.PUBLIC,
      },
      securityGroup: this.securityGroups.bastionHostSecurityGroup,
    });
    host.allowSshAccessFrom(Peer.anyIpv4());
    host.allowSshAccessFrom(Peer.anyIpv6());
    // Allow SSM access
    host.role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'));
    return host;
  }
}
