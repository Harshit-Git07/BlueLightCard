import { AttributeType, TableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { Stack } from 'sst/constructs';

import { isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';

export function createSearchOfferCompanyTable(stack: Stack): TableV2 {
  return new TableV2(stack, `${stack}-searchOfferCompany`, {
    tableName: `${stack}-searchOfferCompany`,
    pointInTimeRecovery: true,
    deletionProtection: isProduction(stack.stage) || isStaging(stack.stage),
    partitionKey: {
      name: 'partitionKey',
      type: AttributeType.STRING,
    },
    sortKey: {
      name: 'sortKey',
      type: AttributeType.STRING,
    },
    globalSecondaryIndexes: [
      {
        indexName: 'gsi1',
        partitionKey: {
          name: 'gsi1PartitionKey',
          type: AttributeType.STRING,
        },
        sortKey: {
          name: 'gsi1SortKey',
          type: AttributeType.STRING,
        },
      },
      {
        indexName: 'gsi2',
        partitionKey: {
          name: 'gsi2PartitionKey',
          type: AttributeType.STRING,
        },
        sortKey: {
          name: 'gsi2SortKey',
          type: AttributeType.STRING,
        },
      },
    ],
  });
}
