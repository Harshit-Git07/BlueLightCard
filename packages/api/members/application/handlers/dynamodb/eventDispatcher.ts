import { DynamoDBRecord, DynamoDBStreamEvent } from 'aws-lambda';
import { AttributeValue as StreamAttributeValue } from 'aws-lambda/trigger/dynamodb-stream';
import { getEnv } from '@blc-mono/core/utils/getEnv';
import { dynamoDBMiddleware, logger } from '@blc-mono/members/application/middleware';
import { ValidationError } from '@blc-mono/members/application/errors/ValidationError';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/constants/environment';
import {
  brazeEventsService,
  dwhEventsService,
  emailEventsService,
  legacyEventsService,
  systemEventsService,
} from '@blc-mono/members/application/events/providers/EventServiceProviders';
import {
  getStreamRecordType,
  StreamRecordTypes,
} from '@blc-mono/members/application/types/steamRecordTypes';

export const unwrappedHandler = async (event: DynamoDBStreamEvent): Promise<void> => {
  if (getEnv(MemberStackEnvironmentKeys.SERVICE_LAYER_EVENTS_ENABLED_GLOBAL) !== 'true') return;

  await Promise.all(event.Records.map(processDynamoDBRecord));
};

async function processDynamoDBRecord(record: DynamoDBRecord): Promise<void> {
  const recordType = parseRecordSortKey(record.dynamodb?.Keys?.sk);
  logger.info({ message: `Processing record type '${recordType}'` });

  if (record.eventName === 'INSERT') {
    switch (recordType) {
      case 'Profile':
        await emailEventsService().emitEmailSignupEvent(record.dynamodb);
        await brazeEventsService().emitProfileCreatedEvent(record.dynamodb);
        await dwhEventsService().emitProfileCreatedEvent(record.dynamodb);
        await legacyEventsService().emitProfileCreatedEvent(record.dynamodb);
        break;
      case 'Application':
        await brazeEventsService().emitApplicationCreatedEvent(record.dynamodb);
        await dwhEventsService().emitApplicationCreatedEvent(record.dynamodb);
        break;
      case 'Card':
        await emailEventsService().emitCardCreatedEvent(record.dynamodb);
        await brazeEventsService().emitCardCreatedEvent(record.dynamodb);
        await dwhEventsService().emitCardCreatedEvent(record.dynamodb);
        await legacyEventsService().emitCardCreatedEvent(record.dynamodb);
        break;
      case 'Note':
        // TODO: Implement note related events
        break;
    }
  }

  if (record.eventName === 'MODIFY') {
    switch (recordType) {
      case 'Profile':
        await systemEventsService().emitProfileUpdatedEvent(record.dynamodb);
        await brazeEventsService().emitProfileUpdatedEvents(record.dynamodb);
        await dwhEventsService().emitProfileUpdatedEvent(record.dynamodb);
        await legacyEventsService().emitProfileUpdatedEvent(record.dynamodb);
        break;
      case 'Application':
        await systemEventsService().emitApplicationUpdatedEvent(record.dynamodb);
        await emailEventsService().emitApplicationUpdatedEvents(record.dynamodb);
        await brazeEventsService().emitApplicationUpdatedEvents(record.dynamodb);
        await dwhEventsService().emitApplicationUpdatedEvent(record.dynamodb);
        break;
      case 'Card':
        await emailEventsService().emitCardUpdatedEvents(record.dynamodb);
        await brazeEventsService().emitCardUpdatedEvents(record.dynamodb);
        await dwhEventsService().emitCardUpdatedEvent(record.dynamodb);
        await legacyEventsService().emitCardUpdatedEvent(record.dynamodb);
        break;
      case 'Note':
        // TODO: Implement note related events
        break;
    }
  }
}

function parseRecordSortKey(sortKey: StreamAttributeValue | undefined): StreamRecordTypes {
  if (!sortKey || !sortKey.S) throw new ValidationError('Stream record missing sortKey: sk');

  return getStreamRecordType(sortKey.S);
}

export const handler = dynamoDBMiddleware(unwrappedHandler);
