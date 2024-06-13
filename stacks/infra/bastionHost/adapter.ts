import { BastionHostLinux, Connections, SecurityGroup } from 'aws-cdk-lib/aws-ec2';

/**
 * **IMPORTANT:** The bastion host allows production access to databases via a
 *                set of shared credentails. DO NOT USE IT if your database
 *                contains sensitive information of any kind.
 * 
 * @deprecated Please read the above note carefully.
 */
export interface IBastionHostAdapter {
  /**
   * @deprecated IMPORTANT: Please read the note in stacks/infra/bastionHost/adapter.ts
   */
  getBastionHost(): BastionHostLinux;
  /**
   * @deprecated IMPORTANT: Please read the note in stacks/infra/bastionHost/adapter.ts
   */
  getConnection(): Connections;
  /**
   * @deprecated IMPORTANT: Please read the note in stacks/infra/bastionHost/adapter.ts
   */
  getDefaultsSecurityGroup(): SecurityGroup;
}
