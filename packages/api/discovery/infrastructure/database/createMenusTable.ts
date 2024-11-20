import { TableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { Stack } from 'sst/constructs';

import { createTable, getGlobalSecondaryIndexes } from './createTable';

export function createMenusTable(stack: Stack): TableV2 {
  return createTable(stack, 'menus', getGlobalSecondaryIndexes(3));
}
