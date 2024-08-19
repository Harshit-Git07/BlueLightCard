import { BastionHostLinux, Connections, SecurityGroup } from 'aws-cdk-lib/aws-ec2';

/**
 * **IMPORTANT:** The bastion host allows production access to databases via a
 *                set of shared credentails. DO NOT USE IT if your database
 *                contains sensitive information of any kind.
 */
export interface IBastionHostAdapter {
  getBastionHost(): BastionHostLinux;
  getConnection(): Connections;
  getDefaultsSecurityGroup(): SecurityGroup;
}
