import { Stack } from 'aws-cdk-lib';
import { Table } from 'sst/constructs';

import { CreateRedemptionConfigTable } from './tablesHelper';

export class Tables {
  public redemptionConfig: Table;
  constructor(stack: Stack) {
    this.redemptionConfig = CreateRedemptionConfigTable(stack);
  }
}
