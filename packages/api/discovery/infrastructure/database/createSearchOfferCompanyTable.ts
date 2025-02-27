import { TableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { Stack } from 'sst/constructs';

import { createTable, getGlobalSecondaryIndexes } from './createTable';

export function createSearchOfferCompanyTable(stack: Stack): TableV2 {
  return createTable(stack, 'searchOfferCompany', getGlobalSecondaryIndexes(2));
}
