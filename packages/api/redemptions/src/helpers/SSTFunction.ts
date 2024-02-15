import { Grant } from 'aws-cdk-lib/aws-iam';
import { Function, FunctionProps, Stack } from 'sst/constructs';

import { IDatabase } from '../database/adapter';

type FunctionPropertiesWithDatabase = FunctionProps & { database?: IDatabase | undefined };

export class SSTFunction extends Function {
  private readonly dbGrants: Grant[] = [];

  constructor(stack: Stack, name: string, functionProps: FunctionPropertiesWithDatabase) {
    const { database } = functionProps;
    const configuredProps = functionProps.database
      ? functionProps.database.getFunctionProps(functionProps)
      : functionProps;

    super(stack, `${name}-${stack.stage}`, configuredProps);
    if (database && database.grantConnect) {
      this.dbGrants.push(...database.grantConnect(this));
    }
  }

  public getGrants(): Grant[] {
    return this.dbGrants;
  }
}
