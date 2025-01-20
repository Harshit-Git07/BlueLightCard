import { DynamoDBRecord, DynamoDBStreamEvent } from 'aws-lambda';
import { AttributeValue as StreamAttributeValue } from 'aws-lambda/trigger/dynamodb-stream';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { dynamoDBMiddleware } from '@blc-mono/members/application/middleware';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/constants/environment';
import { BrazeEventsService } from '@blc-mono/members/application/events/BrazeEventsService';
import { DwhEventsService } from '@blc-mono/members/application/events/DwhEventsService';
import { EmailEventsService } from '@blc-mono/members/application/events/EmailEventsService';
import { LegacyEventsService } from '@blc-mono/members/application/events/LegacyEventsService';
import { SystemEventsService } from '@blc-mono/members/application/events/SystemEventsService';

type StreamRecordTypes = 'PROFILE' | 'APPLICATION' | 'CARD';

export const unwrappedHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
  if (getEnv(MemberStackEnvironmentKeys.SERVICE_LAYER_EVENTS_ENABLED_GLOBAL) !== 'true') return;

  event.Records.forEach((record) => {
    processDynamoDBRecord(record);
  });
};

const processDynamoDBRecord = (record: DynamoDBRecord) => {
  const brazeEventsService: BrazeEventsService = new BrazeEventsService();
  const dwhEventsService: DwhEventsService = new DwhEventsService();
  const emailEventsService: EmailEventsService = new EmailEventsService();
  const legacyEventsService: LegacyEventsService = new LegacyEventsService();
  const systemEventsService: SystemEventsService = new SystemEventsService();

  const recordType = parseRecordSortKey(record.dynamodb?.Keys?.sk);

  if (record.eventName === 'INSERT') {
    switch (recordType) {
      case 'PROFILE':
        emailEventsService.isSendProfileCreateToEmail(record.dynamodb);
        brazeEventsService.isSendProfileCreateToBraze(record.dynamodb);
        dwhEventsService.isSendProfileCreateToDwh(record.dynamodb);
        legacyEventsService.isSendProfileCreateToLegacy(record.dynamodb);
        break;
      case 'APPLICATION':
        brazeEventsService.isSendApplicationCreateToBraze(record.dynamodb);
        dwhEventsService.isSendApplicationCreateToDwh(record.dynamodb);
        break;
      case 'CARD':
        emailEventsService.isSendCardCreateToEmail(record.dynamodb);
        brazeEventsService.isSendCardCreateToBraze(record.dynamodb);
        dwhEventsService.isSendCardCreateToDwh(record.dynamodb);
        legacyEventsService.isSendCardCreateToLegacy(record.dynamodb);
        break;
    }
  }

  if (record.eventName === 'MODIFY') {
    switch (recordType) {
      case 'PROFILE':
        systemEventsService.isSendProfileUpdateToSystem(record.dynamodb);
        brazeEventsService.isSendProfileUpdateToBraze(record.dynamodb);
        dwhEventsService.isSendProfileUpdateToDwh(record.dynamodb);
        legacyEventsService.isSendProfileUpdateToLegacy(record.dynamodb);
        break;
      case 'APPLICATION':
        systemEventsService.isSendApplicationUpdateToSystem(record.dynamodb);
        emailEventsService.isSendApplicationUpdateToEmail(record.dynamodb);
        brazeEventsService.isSendApplicationUpdateToBraze(record.dynamodb);
        dwhEventsService.isSendApplicationUpdateToDwh(record.dynamodb);
        break;
      case 'CARD':
        emailEventsService.isSendCardUpdateToEmail(record.dynamodb);
        brazeEventsService.isSendCardUpdateToBraze(record.dynamodb);
        dwhEventsService.isSendCardUpdateToDwh(record.dynamodb);
        legacyEventsService.isSendCardUpdateToLegacy(record.dynamodb);
        break;
    }
  }
};

const parseRecordSortKey = (sortKey: StreamAttributeValue | undefined): StreamRecordTypes => {
  if (!sortKey) throw new ValidationError('Stream record missing sortKey: sk');
  if (!sortKey.S) throw new ValidationError('Stream record missing sortKey: sk');

  if (sortKey.S.startsWith('PROFILE')) {
    return 'PROFILE';
  } else if (sortKey.S.startsWith('APPLICATION')) {
    return 'APPLICATION';
  } else if (sortKey.S.startsWith('CARD')) {
    return 'CARD';
  }

  throw new Error(`Unknown sortKey prefix: ${sortKey}`);
};

export const handler = dynamoDBMiddleware(unwrappedHandler);
