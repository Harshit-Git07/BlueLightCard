process.env.TABLE_NAME = 'Banners';

import { BannerHandler } from '../banner/bannerHandler';
import { DynamoDBDocumentClient, QueryCommand, PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';

const mockEvent = {
  source: 'anySource',
  detail: {
    id: 99999,
    brand: 'blc-uk',
    promotiontype: 10,
    name: 'test',
    start: '2023-08-01 00:00:00',
    end: '2023-08-28 00:00:00',
    status: 1,
    bannername: 'testingimage.jpg',
    isAgeGated: true,
    link: 'https://www.bluelightcard.co.uk',
    cid: 1234,
  },
};

describe('Banner Handler', () => {
  let handler: BannerHandler;
  let dynamoMock: ReturnType<typeof mockClient>;

  beforeEach(() => {
    handler = new BannerHandler(mockEvent);
    dynamoMock = mockClient(DynamoDBDocumentClient);
  });

  afterEach(() => {
    dynamoMock.restore();
  });

  test('should handle banner creation successfully when banner does not exist', async () => {
    dynamoMock.on(QueryCommand).resolves({ Count: 0 });
    dynamoMock.on(PutCommand).resolves({});
    await handler.handleBannerCreated();
    expect(dynamoMock.calls()).toHaveLength(2);
  });

  test('should no create banner when banner exists', async () => {
    dynamoMock.on(QueryCommand).resolves({ Count: 1 });
    dynamoMock.on(PutCommand).resolves({});
    await handler.handleBannerCreated();
    expect(dynamoMock.calls()).toHaveLength(1);
  });

  test('should handle banner update successfully when banner exists', async () => {
    dynamoMock.on(QueryCommand).resolves({ Count: 1, Items: [{ id: 'test-id' }] });
    dynamoMock.on(PutCommand).resolves({});
    await handler.handleBannerUpdated();
    expect(dynamoMock.calls()).toHaveLength(2);
  });

  test('should not call banner update when banner does not exist', async () => {
    dynamoMock.on(QueryCommand).resolves({ Count: 0 });
    dynamoMock.on(PutCommand).resolves({});
    await handler.handleBannerUpdated();
    expect(dynamoMock.calls()).toHaveLength(1);
  });

  test('should handle banner deletion successfully when banner exists', async () => {
    dynamoMock.on(QueryCommand).resolves({ Count: 1, Items: [{ id: 'test-id' }] });
    dynamoMock.on(DeleteCommand).resolves({});
    await handler.handleBannerDeleted();
    expect(dynamoMock.calls()).toHaveLength(2);
  });

  test('should not have call delete command when banner does not exist', async () => {
    dynamoMock.on(QueryCommand).resolves({ Count: 0 });
    dynamoMock.on(DeleteCommand).resolves({});
    await handler.handleBannerDeleted();
    expect(dynamoMock.calls()).toHaveLength(1);
  });

});
