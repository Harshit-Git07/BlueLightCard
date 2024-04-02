import { BastionHostLinux } from 'aws-cdk-lib/aws-ec2';
import { Grant } from 'aws-cdk-lib/aws-iam';
import { Function as SSTFunction, FunctionProps } from 'sst/constructs';

import { DatabaseConnectionConfig } from '@blc-mono/redemptions/libs/database/connection';

import { DatabaseEgressSecurityGroup } from './types';

export interface IDatabase {
  connectionConfig: DatabaseConnectionConfig;
  egressSecurityGroup?: DatabaseEgressSecurityGroup;
  grantConnect?(lambda: SSTFunction): Grant[];
  getFunctionProps(props: FunctionProps): FunctionProps;
  getBastionHost(): BastionHostLinux | null;
}
