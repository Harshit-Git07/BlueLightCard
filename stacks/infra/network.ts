import { IVpc, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Stack } from 'sst/constructs';
import { isProduction, isStaging } from '@blc-mono/core/src/utils/checkEnvironment';
import { isDdsUkBrand } from '@blc-mono/core/src/utils/checkBrand';
import { SubnetConfiguration } from 'aws-cdk-lib/aws-ec2/lib/vpc';

export class Network {
  private readonly _vpc: IVpc;

  constructor(private readonly stack: Stack) {
    switch (true) {
      case isProduction(stack.stage):
        this._vpc = this.createProductionVpc();
        break;
      case isStaging(stack.stage):
        this._vpc = this.createOrRetrieveStagingVpc();
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
   * Creates a VPC for production.
   *
   * @return {Vpc} The created VPC.
   */
  private createProductionVpc(): IVpc {
    return new Vpc(this.stack, 'vpc-shared', {
      vpcName: isDdsUkBrand() ? 'vpc-shared-dds' : 'vpc-shared',
      maxAzs: 3,
      subnetConfiguration: this.subnetConfiguration(),
    });
  }

  /**
   * Creates or retrieves a VPC for staging.
   *
   * @return {Vpc} The created VPC.
   */
  private createOrRetrieveStagingVpc(): IVpc {
    // DDS UK is deployed to the same AWS account as BLC UK and should use its VPC due to AWS limits on Elastic IPs.
    if (isDdsUkBrand()) {
      return this.retrieveStagingVpc();
    }

    return new Vpc(this.stack, 'vpc-shared', {
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
    return Vpc.fromLookup(this.stack, 'vpc-shared', {
      tags: {
        'sst:stage': 'staging',
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
