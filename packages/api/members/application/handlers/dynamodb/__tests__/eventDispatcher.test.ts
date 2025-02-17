import { DynamoDBStreamEvent } from 'aws-lambda';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import {
  brazeEventsService,
  BrazeEventsService,
} from '@blc-mono/members/application/services/events/BrazeEventsService';
import {
  dataWarehouseEventsService,
  DataWarehouseEventsService,
} from '@blc-mono/members/application/services/events/DataWarehouseEventsService';
import {
  emailEventsService,
  EmailEventsService,
} from '@blc-mono/members/application/services/events/EmailEventsService';
import {
  legacyEventsService,
  LegacyEventsService,
} from '@blc-mono/members/application/services/events/LegacyEventsService';
import { emptyContextStub } from '@blc-mono/members/application/utils/testing/emptyContext';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/environment';

jest.mock('@blc-mono/core/utils/getEnv');
jest.mock('@blc-mono/members/application/services/events/BrazeEventsService');
jest.mock('@blc-mono/members/application/services/events/DataWarehouseEventsService');
jest.mock('@blc-mono/members/application/services/events/EmailEventsService');
jest.mock('@blc-mono/members/application/services/events/LegacyEventsService');

const brazeEventsServiceMock = jest.mocked(brazeEventsService);
const dataWarehouseEventsServiceMock = jest.mocked(dataWarehouseEventsService);
const emailEventsServiceMock = jest.mocked(emailEventsService);
const legacyEventsServiceMock = jest.mocked(legacyEventsService);

const BrazeServiceMock = jest.mocked(new BrazeEventsService());
const DataWarehouseEventsServiceMock = jest.mocked(new DataWarehouseEventsService());
const EmailEventsServiceMock = jest.mocked(new EmailEventsService());
const LegacyEventsServiceMock = jest.mocked(new LegacyEventsService());

describe('eventDispatcher handler', () => {
  const mockEvent: DynamoDBStreamEvent = {
    Records: [
      {
        eventID: '1',
        eventVersion: '1.0',
        dynamodb: {
          Keys: {
            pk: {
              S: 'MEMBER#d838d443-662e-4ae0-b2f9-da15a95249a3',
            },
            sk: {
              S: 'PROFILE',
            },
          },
          NewImage: {
            pk: {
              S: 'MEMBER#d838d443-662e-4ae0-b2f9-da15a95249a3',
            },
            sk: {
              S: 'PROFILE',
            },
          },
          StreamViewType: 'NEW_AND_OLD_IMAGES',
          SequenceNumber: '1',
          SizeBytes: 200,
        },
        awsRegion: 'us-west-2',
        eventName: 'INSERT',
        eventSourceARN: 'arn:aws:dynamodb:us-east-1:123456789012:table/images',
        eventSource: 'aws:dynamodb',
      },
    ],
  };

  const mockResponse: object = {
    Keys: { pk: { S: 'MEMBER#d838d443-662e-4ae0-b2f9-da15a95249a3' }, sk: { S: 'PROFILE' } },
    NewImage: { pk: { S: 'MEMBER#d838d443-662e-4ae0-b2f9-da15a95249a3' }, sk: { S: 'PROFILE' } },
    SequenceNumber: '1',
    SizeBytes: 200,
    StreamViewType: 'NEW_AND_OLD_IMAGES',
  };

  beforeEach(() => {
    (getEnv as jest.Mock).mockImplementation((name: string) => {
      if (name === MemberStackEnvironmentKeys.SERVICE_LAYER_EVENTS_ENABLED_GLOBAL) {
        return 'true';
      }
    });

    brazeEventsServiceMock.mockReturnValue(BrazeServiceMock);
    dataWarehouseEventsServiceMock.mockReturnValue(DataWarehouseEventsServiceMock);
    emailEventsServiceMock.mockReturnValue(EmailEventsServiceMock);
    legacyEventsServiceMock.mockReturnValue(LegacyEventsServiceMock);

    BrazeServiceMock.emitProfileCreatedEvent.mockResolvedValue(undefined);
    DataWarehouseEventsServiceMock.emitProfileCreatedEvent.mockResolvedValue(undefined);
    EmailEventsServiceMock.emitEmailSignupEvent.mockResolvedValue(undefined);
    LegacyEventsServiceMock.emitProfileCreatedEvent.mockResolvedValue(undefined);
  });

  it('should process the event and send messages', async () => {
    await handler(mockEvent);

    expect(BrazeServiceMock.emitProfileCreatedEvent).toHaveBeenCalledWith(mockResponse);
    expect(DataWarehouseEventsServiceMock.emitProfileCreatedEvent).toHaveBeenCalledWith(
      mockResponse,
    );
    expect(EmailEventsServiceMock.emitEmailSignupEvent).toHaveBeenCalledWith(mockResponse);
    expect(LegacyEventsServiceMock.emitProfileCreatedEvent).toHaveBeenCalledWith(mockResponse);
  });
});

async function handler(event: DynamoDBStreamEvent): Promise<void> {
  return await (await import('../eventDispatcher')).handler(event, emptyContextStub);
}
