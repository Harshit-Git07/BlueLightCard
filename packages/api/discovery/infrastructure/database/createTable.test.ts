import { AttributeType } from 'aws-cdk-lib/aws-dynamodb';

import { GSI1_NAME, GSI2_NAME } from '@blc-mono/discovery/application/repositories/constants/DynamoDBConstants';

import { getGlobalSecondaryIndexes } from './createTable';

describe('getGlobalSecondaryIndexes', () => {
  it('should return an empty array when numberOfGSIs is 0', () => {
    const result = getGlobalSecondaryIndexes(0);
    expect(result).toEqual([]);
  });

  it('should return one GSI when numberOfGSIs is 1', () => {
    const result = getGlobalSecondaryIndexes(1);
    expect(result).toEqual([
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
    ]);
  });

  it('should return two GSIs when numberOfGSIs is 2', () => {
    const result = getGlobalSecondaryIndexes(2);
    expect(result).toEqual([
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
    ]);
  });
});
