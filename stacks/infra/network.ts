import { IVpc, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Stack } from 'sst/constructs';
import { isProduction, isStaging } from '@blc-mono/core/src/utils/checkEnvironment';
import { isDdsUkBrand } from '@blc-mono/core/src/utils/checkBrand';
import { SubnetConfiguration } from 'aws-cdk-lib/aws-ec2/lib/vpc';

enum VpcName {
  BLC = 'vpc-shared',
  DDS = 'vpc-shared-dds',
}

enum TagName {
  BLC = 'staging',
  DDS = 'staging-dds',
}

export class Network {
  private readonly _vpc: IVpc;

  constructor(private readonly stack: Stack) {
    switch (true) {
      case isProduction(stack.stage):
        this._vpc = this.createVpc();
        break;
      case isStaging(stack.stage):
        this._vpc = this.createVpc();
        break;
      default:
        this._vpc = this.retrieveStagingVpc();
        break;
    }
  }

  get vpc(): IVpc {
    return this._vpc;
  }

  /**
   * Creates a VPC.
   *
   * @return {Vpc} The created VPC.
   */
  private createVpc(): IVpc {
    const vpcName = isDdsUkBrand() ? VpcName.DDS : VpcName.BLC;

    return new Vpc(this.stack, vpcName, {
      vpcName: vpcName,
      maxAzs: 3,
      subnetConfiguration: this.subnetConfiguration(),
    });
  }

  /**
   * Retrieves the staging VPC.
   *
   * The Dev environment uses the staging VPC.
   * @return {Vpc} The staging VPC.
   */
  private retrieveStagingVpc(): IVpc {
    const vpcName = isDdsUkBrand() ? VpcName.DDS : VpcName.BLC;
    const tagName = isDdsUkBrand() ? TagName.DDS : TagName.BLC;

    return Vpc.fromLookup(this.stack, vpcName, {
      tags: {
        'sst:stage': tagName,
      },
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
}
