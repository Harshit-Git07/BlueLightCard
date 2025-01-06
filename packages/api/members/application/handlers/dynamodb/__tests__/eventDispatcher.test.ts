import { DynamoDBStreamEvent } from 'aws-lambda';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/constants/environment';
import { BrazeEventsService } from '@blc-mono/members/application/events/BrazeEventsService';
import { DwhEventsService } from '@blc-mono/members/application/events/DwhEventsService';
import { EmailEventsService } from '@blc-mono/members/application/events/EmailEventsService';
import { LegacyEventsService } from '@blc-mono/members/application/events/LegacyEventsService';

jest.mock('@blc-mono/core/utils/getEnv');
jest.mock('@blc-mono/members/application/events/BrazeEventsService');
jest.mock('@blc-mono/members/application/events/DwhEventsService');
jest.mock('@blc-mono/members/application/events/EmailEventsService');
jest.mock('@blc-mono/members/application/events/LegacyEventsService');

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

  const context = {} as any;

  let mockIsSendProfileCreateToBraze = jest.fn();
  let mockIsSendProfileCreateToDwh = jest.fn();
  let mockIsSendProfileCreateToEmail = jest.fn();
  let mockIsSendProfileCreateToLegacy = jest.fn();

  beforeEach(() => {
    (getEnv as jest.Mock).mockImplementation((name: string) => {
      if (name === MemberStackEnvironmentKeys.SERVICE_LAYER_EVENTS_ENABLED_GLOBAL) {
        return 'true';
      }
    });

    BrazeEventsService.prototype.isSendProfileCreateToBraze = mockIsSendProfileCreateToBraze;
    DwhEventsService.prototype.isSendProfileCreateToDwh = mockIsSendProfileCreateToDwh;
    EmailEventsService.prototype.isSendProfileCreateToEmail = mockIsSendProfileCreateToEmail;
    LegacyEventsService.prototype.isSendProfileCreateToLegacy = mockIsSendProfileCreateToLegacy;
  });

  it('should process the event and send messages', async () => {
    mockIsSendProfileCreateToBraze.mockResolvedValue(undefined);
    mockIsSendProfileCreateToDwh.mockResolvedValue(undefined);
    mockIsSendProfileCreateToEmail.mockResolvedValue(undefined);
    mockIsSendProfileCreateToLegacy.mockResolvedValue(undefined);

    await handler(mockEvent, context);

    expect(mockIsSendProfileCreateToBraze).toHaveBeenCalledWith(mockResponse);
    expect(mockIsSendProfileCreateToDwh).toHaveBeenCalledWith(mockResponse);
    expect(mockIsSendProfileCreateToEmail).toHaveBeenCalledWith(mockResponse);
    expect(mockIsSendProfileCreateToLegacy).toHaveBeenCalledWith(mockResponse);
  });
});

async function handler(event: DynamoDBStreamEvent, context: any): Promise<void> {
  return (await import('../eventDispatcher')).handler(event, context);
}
