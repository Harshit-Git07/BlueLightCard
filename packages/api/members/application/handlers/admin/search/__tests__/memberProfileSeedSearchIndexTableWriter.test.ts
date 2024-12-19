import { Context, SQSEvent } from 'aws-lambda';
import { Repository } from '@blc-mono/members/application/repositories/repository';
import 'aws-sdk-client-mock-jest';
import { getMemberProfilesSeedSearchIndexTableName } from '@blc-mono/members/application/handlers/admin/search/getMemberProfileResources';

jest.mock('@blc-mono/members/application/repositories/repository');
jest.mock('../getMemberProfileResources');

const getMemberProfilesSeedSearchIndexTableNameMock = jest.mocked(
  getMemberProfilesSeedSearchIndexTableName,
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
  const context = {} as Context;

  afterEach(() => {
    jest.resetAllMocks();
  });

  beforeEach(() => {
    getMemberProfilesSeedSearchIndexTableNameMock.mockReturnValue('mockTableName');
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
    } as any;

    await handler(event, context);

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

async function handler(event: SQSEvent, context: Context) {
  return (await import('../memberProfileSeedSearchIndexTableWriter')).handler(event, context);
}
