import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { EventOffer } from '@blc-mono/discovery/application/models/Offer';
import { buildErrorMessage } from '@blc-mono/discovery/application/repositories/Company/service/utils/ErrorMessageBuilder';

import { EventRepository } from '../EventRepository';

import { mapEventEntityToEvent, mapEventToEventEntity } from './mapper/EventMapper';

const logger = new LambdaLogger({ serviceName: 'offer-service' });

type EventKeyReference = { id: string; venueId: string };

export async function insertEvent(event: EventOffer): Promise<void> {
  try {
    const eventEntity = mapEventToEventEntity(event);
    await new EventRepository().insert(eventEntity);
    logger.info({ message: `Inserted Event with id: [${eventEntity.id}]` });
  } catch (error) {
    throw new Error(buildErrorMessage(logger, error, `Error occurred inserting new Event with id: [${event.id}]`));
  }
}

export async function deleteEvent(id: string, venueId: string): Promise<void> {
  try {
    await new EventRepository().delete(id, venueId);
    logger.info({ message: `Deleted Event with id: [${id}]` });
  } catch (error) {
    throw new Error(buildErrorMessage(logger, error, `Error occurred deleting Event with id: [${id}]`));
  }
}

export async function getEventById(id: string, venueId: string): Promise<EventOffer | undefined> {
  try {
    const result = await new EventRepository().retrieveById(id, venueId);
    if (!result) {
      return;
    }
    logger.info({ message: `Retrieved Event with id: [${id}]` });
    return mapEventEntityToEvent(result);
  } catch (error) {
    throw new Error(buildErrorMessage(logger, error, `Error occurred retrieving Event by id: [${id}]`));
  }
}

export async function getEventsByIds(ids: EventKeyReference[]): Promise<EventOffer[]> {
  try {
    const result = await new EventRepository().retrieveByIds(removeDuplicateEventKeys(ids));
    logger.info({ message: `Retrieved Events by ids. Size [${result.length}]` });
    return result.map(mapEventEntityToEvent);
  } catch (error) {
    throw new Error(buildErrorMessage(logger, error, `Error occurred retrieving Events by ids`));
  }
}

const removeDuplicateEventKeys = (eventKeys: EventKeyReference[]): EventKeyReference[] => {
  const uniqueEventKeys = new Map<string, EventKeyReference>();
  eventKeys.forEach((eventKey) => {
    uniqueEventKeys.set(eventKey.id, eventKey);
  });
  return Array.from(uniqueEventKeys.values());
};

export async function getAllEvents(): Promise<EventOffer[]> {
  try {
    const result = await new EventRepository().retrieveAll();
    logger.info({ message: `Retrieved all Events. Size [${result.length}]` });
    return result.map(mapEventEntityToEvent);
  } catch (error) {
    throw new Error(buildErrorMessage(logger, error, `Error occurred retrieving all Events`));
  }
}
