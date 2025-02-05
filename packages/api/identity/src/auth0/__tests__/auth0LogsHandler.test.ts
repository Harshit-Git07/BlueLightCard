import { handler } from '../auth0LogsHandler';
import { sendToDLQ } from 'src/helpers/DLQ';
import { Logger } from '@aws-lambda-powertools/logger';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { IdentityStackEnvironmentKeys } from '@blc-mono/identity/src/utils/identityStackEnvironmentKeys';
import { Response } from '../../../../core/src/utils/restResponse/response';
import { FirehoseClient, PutRecordCommand } from '@aws-sdk/client-firehose';
import { EventBridgeEvent } from 'aws-lambda';

jest.mock('src/helpers/DLQ');
jest.mock('@aws-lambda-powertools/logger');
jest.mock('../../../../core/src/utils/restResponse/response');
jest.mock('@aws-sdk/client-firehose');
jest.mock('@blc-mono/core/utils/getEnv', () => ({
  getEnv: jest.fn(),
  getEnvOrDefault: jest.fn(()=>'false'),
}));

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
};
(Logger as unknown as jest.Mock).mockImplementation(() => mockLogger);

describe('auth0LogsHandler', () => {
  const mockEvent: EventBridgeEvent<any, any> = {
    id: '1',
    version: '1',
    account: '123456789012',
    time: '2021-01-01T00:00:00Z',
    region: 'us-east-1',
    resources: [],
    source: 'source',
    'detail-type': 'detail-type',
    detail: {
      data: {
        date: '2021-01-01T00:00:00.000Z',
        type: 's',
        description: 'description',
        client_name: 'client_name',
        ip: '127.0.0.1',
        user_id: 'user_id',
        user_name: 'user_name',
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getEnv as jest.Mock).mockImplementation((key: string) => {
      switch (key) {
        case IdentityStackEnvironmentKeys.SERVICE:
          return 'test-service';
        case IdentityStackEnvironmentKeys.AUTH0_DWH_FIREHOSE_LOGS_STREAM:
          return 'test-stream';
        case IdentityStackEnvironmentKeys.BRAND:
          return 'test-brand';
        default:
          return '';
      }
    });
  });

  it('should process event successfully', async () => {
    const mockSend = jest.fn().mockResolvedValue({});
    FirehoseClient.prototype.send = mockSend;

    const response = await handler(mockEvent);

    expect(mockSend).toHaveBeenCalledWith(expect.any(PutRecordCommand));
    expect(response).toEqual(Response.OK({ message: 'auth0 logs processed successfully' }));
  });

  it('should return bad request if event details are missing', async () => {
    const eventWithoutDetails = { ...mockEvent, detail: {} };

    const response = await handler(eventWithoutDetails);

    expect(response).toEqual(Response.BadRequest({ message: 'Please provide valid event details' }));
  });

  it('should handle error and send to DLQ', async () => {
    const mockSend = jest.fn().mockRejectedValue(new Error('Firehose error'));
    FirehoseClient.prototype.send = mockSend;

    const response = await handler(mockEvent);

    expect(sendToDLQ).toHaveBeenCalledWith(mockEvent);
    expect(response).toEqual(Response.Error(new Error('Firehose error')));
  });
});