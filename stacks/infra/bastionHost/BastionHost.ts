import { BastionHostLinux, InstanceClass, InstanceSize, InstanceType, IVpc, SecurityGroup } from 'aws-cdk-lib/aws-ec2';
import { App, Stack } from 'sst/constructs';
import { ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { IBastionHostAdapter } from './adapter';
import { isProduction, isStaging } from '@blc-mono/core/src/utils/checkEnvironment';

interface IBastionHost {
  get bastionHostAdapter(): IBastionHostAdapter | undefined;
}

export class BastionHost implements IBastionHost {
  private readonly _bastionHost: BastionHostLinux | undefined;
  private readonly _defaultSecurityGroup: SecurityGroup | undefined;

  constructor(private readonly stack: Stack, private readonly app: App, private readonly vpc: IVpc) {
    if (isProduction(stack.stage) || isStaging(stack.stage)) {
      this._defaultSecurityGroup = this.createDefaultSecurityGroup();
      this._bastionHost = this.createBastionHost();
    }
  }

  get bastionHostAdapter(): IBastionHostAdapter | undefined {
    if (this.app.mode === 'dev') {
      throw new Error(
        [
          `Bastion host is not allowed in the ${this.stack.stage} stage.`,
          'It is not intended for use in development environments.',
        ].join(' '),
      );
    }
    return {
      getBastionHost: () => this._bastionHost!,
      getConnection: () => this._bastionHost!.connections,
      getDefaultsSecurityGroup: () => this._defaultSecurityGroup!,
    };
  }

  private createBastionHost(): BastionHostLinux {
    const host = new BastionHostLinux(this.stack, 'bastion-host-shared', {
      instanceName: `${this.stack.stage}-bastion-host-shared`,
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.SMALL),
      vpc: this.vpc,
      securityGroup: this._defaultSecurityGroup!,
    });
    host.role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'));
    return host;
  }

  private createDefaultSecurityGroup() {
    return new SecurityGroup(this.stack, 'bastion-host-shared-sg', {
      vpc: this.vpc,
      description: `this is a security group for the bastion host`,
      allowAllOutbound: true,
    });
  }
}
