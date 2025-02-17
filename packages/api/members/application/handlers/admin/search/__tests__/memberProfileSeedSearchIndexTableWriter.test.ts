import { SQSEvent } from 'aws-lambda';
import { Repository } from '@blc-mono/members/application/repositories/base/repository';
import 'aws-sdk-client-mock-jest';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';
import { memberProfilesSeedSearchIndexTableName } from '@blc-mono/members/application/providers/Tables';

jest.mock('@blc-mono/members/application/repositories/base/repository');
jest.mock('@blc-mono/members/application/providers/Tables');

const memberProfilesSeedSearchIndexTableNameMock = jest.mocked(
  memberProfilesSeedSearchIndexTableName,
);

const profile = {
  pk: 'PROFILE#1',
  sk: 'PROFILE#1',
  name: 'John Doe',
};
const card = {
  pk: 'CARD#1',
  sk: 'CARD#1',
  cardNumber: '1234',
};
const application = {
  pk: 'APPLICATION#1',
  sk: 'APPLICATION#1',
  applicationId: '5678',
};

describe('Write to member profile seed index table', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  beforeEach(() => {
    memberProfilesSeedSearchIndexTableNameMock.mockReturnValue('mockTableName');
    Repository.prototype.batchInsert = jest.fn().mockResolvedValue({});
  });

  it('should insert records into the table with updated ingestionLastTriggered', async () => {
    const event: SQSEvent = {
      Records: [
        {
          body: JSON.stringify([profile, card]),
        },
        {
          body: JSON.stringify([application]),
        },
      ],
    } as unknown as SQSEvent;

    await handler(event);

    expect(Repository.prototype.batchInsert).toHaveBeenCalledTimes(2);
    expect(Repository.prototype.batchInsert).toHaveBeenNthCalledWith(
      1,
      [
        {
          ...profile,
          ingestionLastTriggered: expect.any(String),
        },
        {
          ...card,
          ingestionLastTriggered: expect.any(String),
        },
      ],
      'mockTableName',
    );
    expect(Repository.prototype.batchInsert).toHaveBeenNthCalledWith(
      2,
      [
        {
          ...application,
          ingestionLastTriggered: expect.any(String),
        },
      ],
      'mockTableName',
    );
  });
});

async function handler(event: SQSEvent) {
  return await (
    await import('../memberProfileSeedSearchIndexTableWriter')
  ).handler(event, emptyContextStub);
}
