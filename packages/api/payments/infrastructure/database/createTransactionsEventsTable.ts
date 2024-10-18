import { AttributeType, TableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { Stack } from 'sst/constructs';

import { isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';

export function createTransactionsEventTable(stack: Stack): TableV2 {
  return new TableV2(stack, `${stack}-transaction-events`, {
    tableName: `${stack}-transaction-events`,
    pointInTimeRecovery: true,
    deletionProtection: isProduction(stack.stage) || isStaging(stack.stage),
    partitionKey: {
      name: 'pk-memberId',
      type: AttributeType.STRING,
    },
    sortKey: {
      name: 'sk-eventType_objectId',
      type: AttributeType.STRING,
    },
    globalSecondaryIndexes: [
      {
        indexName: 'gsi1',
        partitionKey: {
          name: 'objectId',
          type: AttributeType.STRING,
        },
      },
    ],
  });
}
