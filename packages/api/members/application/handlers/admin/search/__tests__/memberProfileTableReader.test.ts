import { Repository } from '@blc-mono/members/application/repositories/base/repository';
import { ScanCommandOutput } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import 'aws-sdk-client-mock-jest';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';
import { seedSearchIndexTableQueueUrl } from '@blc-mono/members/application/providers/Queues';
import { memberProfilesTableName } from '@blc-mono/members/application/providers/Tables';

jest.mock('@blc-mono/members/application/repositories/base/repository');
jest.mock('@blc-mono/members/application/providers/Queues');
jest.mock('@blc-mono/members/application/providers/Tables');

const memberProfilesTableNameMock = jest.mocked(memberProfilesTableName);
const getSeedSearchIndexTableQueueUrlMock = jest.mocked(seedSearchIndexTableQueueUrl);

const mockSqsClient = mockClient(SQSClient);

const mockScanFirstResponse: ScanCommandOutput = {
  Items: [
    {
      pk: 'pk1',
      sk: 'sk1',
    },
    {
      pk: 'pk2',
      sk: 'sk2',
    },
  ],
  LastEvaluatedKey: {},
  $metadata: {},
};
const mockScanSecondResponse: ScanCommandOutput = {
  Items: [
    {
      pk: 'pk3',
      sk: 'sk3',
    },
  ],
  LastEvaluatedKey: undefined,
  $metadata: {},
};

describe('Read member profile data', () => {
  beforeEach(() => {
    Repository.prototype.scan = jest
      .fn()
      .mockResolvedValueOnce(mockScanFirstResponse)
      .mockResolvedValue(mockScanSecondResponse);
    memberProfilesTableNameMock.mockReturnValue('mockTableName');
    getSeedSearchIndexTableQueueUrlMock.mockReturnValue('queueUrl');
  });

  it('should scan table multiple times', async () => {
    await handler();

    expect(Repository.prototype.scan).toHaveBeenCalledTimes(2);
    expect(Repository.prototype.scan).toHaveBeenCalledWith({
      TableName: 'mockTableName',
      Limit: 500,
      ExclusiveStartKey: undefined,
    });
    expect(Repository.prototype.scan).toHaveBeenCalledWith({
      TableName: 'mockTableName',
      Limit: 500,
      ExclusiveStartKey: {},
    });
  });

  it('should send sqs event', async () => {
    await handler();

    expect(mockSqsClient).toHaveReceivedNthCommandWith(1, SendMessageCommand, {
      QueueUrl: 'queueUrl',
      MessageBody: JSON.stringify([
        {
          pk: 'pk1',
          sk: 'sk1',
        },
        {
          pk: 'pk2',
          sk: 'sk2',
        },
      ]),
    });
    expect(mockSqsClient).toHaveReceivedNthCommandWith(2, SendMessageCommand, {
      QueueUrl: 'queueUrl',
      MessageBody: JSON.stringify([
        {
          pk: 'pk3',
          sk: 'sk3',
        },
      ]),
    });
  });
});

async function handler() {
  return await (await import('../memberProfileTableReader')).handler(emptyContextStub);
}
