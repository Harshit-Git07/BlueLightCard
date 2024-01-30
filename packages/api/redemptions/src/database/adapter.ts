import { Grant } from 'aws-cdk-lib/aws-iam';
import { Function as SSTFunction } from 'sst/constructs';

import { DatabaseConnectionConfig } from './connection';
import { DatabaseEgressSecurityGroup } from './types';

export interface IDatabase {
  connectionConfig: DatabaseConnectionConfig;
  egressSecurityGroup?: DatabaseEgressSecurityGroup;
  grantCredentialsSecretRead(lambda: SSTFunction): Grant | null;
  grantConnect(lambda: SSTFunction): Grant | null;
}
