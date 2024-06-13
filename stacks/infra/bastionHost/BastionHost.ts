import { BastionHostLinux, InstanceClass, InstanceSize, InstanceType, IVpc, SecurityGroup } from 'aws-cdk-lib/aws-ec2';
import { App, Config, Stack } from 'sst/constructs';
import { ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { IBastionHostAdapter } from './adapter';
import { isEphemeral, isProduction, isStaging } from '@blc-mono/core/src/utils/checkEnvironment';
import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { SharedStackEnvironmentKeys } from '../environment';
import { BastionHostAccessUser } from './BastionHostAccessUser';

/**
 * **IMPORTANT:** The bastion host allows production access to databases via a
 *                set of shared credentails. DO NOT USE IT if your database
 *                contains sensitive information of any kind.
 * 
 * @deprecated Please read the above note carefully.
 */
export class BastionHost {
  constructor(private readonly stack: Stack, private readonly vpc: IVpc) {}

  public setup(): IBastionHostAdapter | undefined {
    // Only create the bastion host for staging and production environments,
    // unless the DANGEROUSLY_ALLOW_SHARED_BASTION_HOST flag is set.
    if (
      !getEnvRaw(SharedStackEnvironmentKeys.DANGEROUSLY_ALLOW_SHARED_BASTION_HOST)
      && !isProduction(this.stack.stage)
      && !isStaging(this.stack.stage)
      && !isEphemeral(this.stack.stage)
    ) {
      return;
    }

    const defaultSecurityGroup = this.createDefaultSecurityGroup();
    const bastionHost = this.createBastionHost(defaultSecurityGroup);
    this.createBastionHostAccessUser(bastionHost);
    return this.createBastionHostAdapter(bastionHost, defaultSecurityGroup);
  }

  private createDefaultSecurityGroup() {
    return new SecurityGroup(this.stack, 'bastion-host-shared-sg', {
      vpc: this.vpc,
      description: 'this is a security group for the bastion host',
      allowAllOutbound: true,
    });
  }

  private createBastionHost(securityGroup: SecurityGroup): BastionHostLinux {
    const host = new BastionHostLinux(this.stack, 'bastion-host-shared', {
      instanceName: `${this.stack.stage}-bastion-host-shared`,
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.SMALL),
      vpc: this.vpc,
      securityGroup: securityGroup,
    });
    host.role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'));
    new Config.Parameter(this.stack, 'SHARED_BASTION_HOST_INSTANCE', {
      value: host.instanceId,
    });
    return host;
  }

  private createBastionHostAccessUser(bastionHost: BastionHostLinux) {
    // Only create the user for staging and production environments, unless the
    // DANGEROUSLY_ALLOW_DB_ACCESS_USER_CREATION flag is set.
    if (
      !getEnvRaw(SharedStackEnvironmentKeys.DANGEROUSLY_ALLOW_DB_ACCESS_USER_CREATION) &&
      !isProduction(this.stack.stage) &&
      !isStaging(this.stack.stage)
    ) {
      return;
    }

    new BastionHostAccessUser(this.stack, bastionHost).setup();
  }

  private createBastionHostAdapter(
    bastionHost: BastionHostLinux,
    defaultSecurityGroup: SecurityGroup,
  ): IBastionHostAdapter {
    return {
      getBastionHost: () => bastionHost,
      getConnection: () => bastionHost.connections,
      getDefaultsSecurityGroup: () => defaultSecurityGroup,
    };
  }
}
