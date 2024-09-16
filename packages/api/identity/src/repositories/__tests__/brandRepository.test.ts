import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { BrandRepository } from '../brandRepository';

describe('BrandRepository', () => {
  let brandRepository: BrandRepository;
  let dynamoMock: ReturnType<typeof mockClient>;

  beforeEach(() => {
    brandRepository = new BrandRepository('staging-blc-mono-identityTable', 'eu-west-2');

    // Mock the DynamoDB client's query method
    dynamoMock = mockClient(DynamoDBDocumentClient);
    dynamoMock.on(QueryCommand).resolves({
      Items: [
        {
          pk: 'MEMBER#0000005',
          sk: 'BRAND#BLC_UK',
          legacy_id: '9800089898',
        },
      ],
    });
  });

  it('should find by uuid', async () => {
    const result = await brandRepository.findItemsByUuid('0000005');

    // Assert that the result is correct
    expect(result).toEqual({
      Items: [
        {
          pk: 'MEMBER#0000005',
          sk: 'BRAND#BLC_UK',
          legacy_id: '9800089898',
        },
      ],
    });
  });
});
