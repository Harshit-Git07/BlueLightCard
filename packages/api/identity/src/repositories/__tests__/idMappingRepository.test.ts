import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';

import { IdMappingRepository, IIdMappingRepository } from '../idMappingRepository';
import 'aws-sdk-client-mock-jest';

let idMappingRepository: IIdMappingRepository = new IdMappingRepository();
let dynamoMock: ReturnType<typeof mockClient> = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
  dynamoMock.reset();
});

describe('findByLegacyId', () => {
  it('should call dynamoDb', async () => {
    await idMappingRepository.findByLegacyId('BLC_UK', 'someLegacyId');

    const queryParams = {
      TableName: 'someIdMappingTableName',
      KeyConditionExpression: '#legacy_id= :legacy_id',
      ExpressionAttributeValues: {
        ':legacy_id': `BRAND#BLC_UK#someLegacyId`,
      },
      ExpressionAttributeNames: {
        '#legacy_id': 'legacy_id',
      },
    };

    expect(dynamoMock).toHaveReceivedCommandWith(QueryCommand, queryParams);
  });

  it('should return response', async () => {
    const response = {
      $metadata: {
        httpStatusCode: 200,
        requestId: '698LOHMFMO7NHPC1TG7MLRVE7VVV4KQNSO5AEMVJF66Q9ASUAAJG',
        attempts: 1,
        totalRetryDelay: 0,
      },
      Attributes: undefined,
      ItemCollectionMetrics: undefined,
    };

    dynamoMock.on(QueryCommand).resolves(response);

    const result = await idMappingRepository.findByLegacyId('BLC_UK', 'someLegacyId');

    expect(result).toEqual(response);
  });
});
