import { BastionHostLinux, Connections, SecurityGroup } from 'aws-cdk-lib/aws-ec2';

export interface IBastionHostAdapter {
  getBastionHost(): BastionHostLinux;
  getConnection(): Connections;
  getDefaultsSecurityGroup(): SecurityGroup;
}
