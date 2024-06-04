import { BastionHostLinux, InstanceClass, InstanceSize, InstanceType, IVpc, SecurityGroup } from 'aws-cdk-lib/aws-ec2';
import { App, Config, Stack } from 'sst/constructs';
import { ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { IBastionHostAdapter } from './adapter';
import { isEphemeral, isProduction, isStaging } from '@blc-mono/core/src/utils/checkEnvironment';
import { getEnvRaw } from '@blc-mono/core/utils/getEnv';
import { SharedStackEnvironmentKeys } from '../environment';

export class BastionHost {
  constructor(private readonly stack: Stack, private readonly vpc: IVpc) {}

  public setup(): IBastionHostAdapter | undefined {
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
