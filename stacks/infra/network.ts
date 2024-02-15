import { IVpc, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Stack } from 'sst/constructs';
import { isDev } from '@blc-mono/core/src/utils/checkEnvironment';
import { SubnetConfiguration } from 'aws-cdk-lib/aws-ec2/lib/vpc';

export class Network {
  private readonly _vpc: IVpc;

  constructor(private readonly stack: Stack) {
    this._vpc = isDev(stack.stage) ? this.retrieveStagingVpc() : this.createVpc();
  }

  get vpc(): IVpc {
    return this._vpc;
  }

  /**
   * Creates a VPC.
   *
   * @return {Vpc} The created VPC.
   */
  private createVpc(): Vpc {
    return new Vpc(this.stack, 'vpc-shared', {
      maxAzs: 3,
      subnetConfiguration: this.subnetConfiguration(),
    });
  }

  /**
   * Returns an array of subnet configurations.
   *
   * The subnet configurations are used to create the VPC.
   *
   * @return {SubnetConfiguration[]} an array of subnet configurations (public , private, isolated).
   */
  private subnetConfiguration(): SubnetConfiguration[] {
    return [
      {
        name: 'public',
        subnetType: SubnetType.PUBLIC,
        cidrMask: 24,
      },
      {
        name: 'private',
        subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        cidrMask: 24,
      },
      {
        name: 'isolated',
        subnetType: SubnetType.PRIVATE_ISOLATED,
        cidrMask: 24,
      },
    ];
  }

  /**
   * Retrieves the staging VPC.
   *
   * The Dev environment uses the staging VPC.
   * @return {Vpc} The staging VPC.
   */
  private retrieveStagingVpc(): IVpc {
    return Vpc.fromLookup(this.stack, 'sharedVpc', {
      tags: {
        'sst:stage': 'staging',
      },
    });
  }
}
