import { DeleteCommand, DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { CompanyFollowsRepository, ICompanyFollowsRepository } from '../companyFollowsRepository';
import 'aws-sdk-client-mock-jest';

let companyFollowsRepository: ICompanyFollowsRepository = new CompanyFollowsRepository();
let dynamoMock: ReturnType<typeof mockClient> = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
  dynamoMock.reset();
});

describe('updateCompanyFollows', () => {
  it('should call dynamoDb', async () => {
    await companyFollowsRepository.updateCompanyFollows('0000005', 'someCompanyId', 'like');

    const putParams = {
      Item: {
        pk: `MEMBER#0000005`,
        sk: `COMPANYFOLLOWS#someCompanyId`,
        likeType: 'like',
      },
      TableName: 'someIdentityTableName',
    };

    expect(dynamoMock).toHaveReceivedCommandWith(PutCommand, putParams);
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

    dynamoMock.on(PutCommand).resolves(response);

    const result = await companyFollowsRepository.updateCompanyFollows(
      '0000005',
      'someCompanyId',
      'like',
    );

    expect(result).toEqual(response);
  });
});

describe('deleteCompanyFollows', () => {
  it('should call dynamoDb', async () => {
    await companyFollowsRepository.deleteCompanyFollows('0000005', 'someCompanyId');

    const deleteParams = {
      Key: {
        pk: `MEMBER#0000005`,
        sk: `COMPANYFOLLOWS#someCompanyId`,
      },
      TableName: 'someIdentityTableName',
    };

    expect(dynamoMock).toHaveReceivedCommandWith(DeleteCommand, deleteParams);
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

    dynamoMock.on(DeleteCommand).resolves(response);

    const result = await companyFollowsRepository.deleteCompanyFollows('0000005', 'someCompanyId');

    expect(result).toEqual(response);
  });
});
