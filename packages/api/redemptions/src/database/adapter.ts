import { Grant } from 'aws-cdk-lib/aws-iam';
import { Function as SSTFunction, FunctionProps } from 'sst/constructs';

import { DatabaseConnectionConfig } from './connection';
import { DatabaseEgressSecurityGroup } from './types';

export interface IDatabase {
  connectionConfig: DatabaseConnectionConfig;
  egressSecurityGroup?: DatabaseEgressSecurityGroup;
  grantConnect?(lambda: SSTFunction): Grant[];
  getFunctionProps(props: FunctionProps): FunctionProps;
}
