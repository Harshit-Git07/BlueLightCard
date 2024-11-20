import { AttributeType, GlobalSecondaryIndexPropsV2, TableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { Stack } from 'sst/constructs';

import { isProduction, isStaging } from '@blc-mono/core/utils/checkEnvironment';
import {
  GSI1_NAME,
  GSI2_NAME,
  GSI3_NAME,
} from '@blc-mono/discovery/application/repositories/constants/DynamoDBConstants';

export function createTable(
  stack: Stack,
  name: string,
  globalSecondaryIndexes: GlobalSecondaryIndexPropsV2[],
): TableV2 {
  const tableName = buildTableName(stack, name);
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
    globalSecondaryIndexes,
  });
}

export function buildTableName(stack: Stack, name: string): string {
  return stack.region === 'ap-southeast-2' ? `${stack}-aus-${name}` : `${stack}-${name}`;
}

export const getGlobalSecondaryIndexes = (numberOfGSIs: number): GlobalSecondaryIndexPropsV2[] => {
  const globalSecondaryIndexes = [
    {
      indexName: GSI1_NAME,
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
      indexName: GSI2_NAME,
      partitionKey: {
        name: 'gsi2PartitionKey',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'gsi2SortKey',
        type: AttributeType.STRING,
      },
    },
    {
      indexName: GSI3_NAME,
      partitionKey: {
        name: 'gsi3PartitionKey',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'gsi3SortKey',
        type: AttributeType.STRING,
      },
    },
  ];
  return globalSecondaryIndexes.slice(0, numberOfGSIs);
};
