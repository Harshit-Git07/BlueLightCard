import { AttributeType, TableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { Stack } from 'sst/constructs';

import { isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';

export function createTransactionsEventTable(stack: Stack): TableV2 {
  return new TableV2(stack, `${stack}-transaction-events`, {
    tableName: `${stack}-transaction-events`,
    pointInTimeRecovery: true,
    deletionProtection: isProduction(stack.stage) || isStaging(stack.stage),
    partitionKey: {
      name: 'pk',
      type: AttributeType.STRING,
    },
    sortKey: {
      name: 'sk',
      type: AttributeType.STRING,
    },
    globalSecondaryIndexes: [
      {
        indexName: 'gsi1',
        partitionKey: {
          name: 'eventType',
          type: AttributeType.STRING,
        },
        sortKey: {
          name: 'objectId',
          type: AttributeType.STRING,
        },
      },
    ],
  });
}
