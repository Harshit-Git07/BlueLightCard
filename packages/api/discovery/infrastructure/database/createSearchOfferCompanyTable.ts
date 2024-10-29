import { AttributeType, TableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { Stack } from 'sst/constructs';

import { isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';

export function createSearchOfferCompanyTable(stack: Stack): TableV2 {
  const tableName = buildTableName(stack, 'searchOfferCompany');
  return new TableV2(stack, tableName, {
    tableName,
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

function buildTableName(stack: Stack, name: string): string {
  return stack.region === 'ap-southeast-2' ? `${stack}-aus-${name}` : `${stack}-${name}`;
}
