import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { EventOffer } from '@blc-mono/discovery/application/models/Offer';
import { updateEventInMenus } from '@blc-mono/discovery/application/repositories/Menu/service/MenuService';
import {
  deleteEvent,
  getEventById,
  insertEvent,
} from '@blc-mono/discovery/application/repositories/Offer/service/EventService';

const logger = new LambdaLogger({ serviceName: 'event-offer-event-handler' });

export async function handleEventOfferUpdated(newEventRecord: EventOffer): Promise<void> {
  const currentOfferRecord = await getEventById(newEventRecord.id, newEventRecord.venue.id);

  if (!currentOfferRecord || isNewerVersion(newEventRecord, currentOfferRecord)) {
    await insertEvent(newEventRecord);
    await updateEventInMenus(newEventRecord);
  } else {
    logger.info({
      message: `Event record with id: [${newEventRecord.id}] is not newer than current stored record, so will not be overwritten.`,
    });
  }
}

export async function handleEventOfferDeleted(deleteEventRecord: EventOffer): Promise<void> {
  const currentRecord = await getEventById(deleteEventRecord.id, deleteEventRecord.venue.id);

  if (!currentRecord) {
    return logger.info({
      message: `Event record with id: [${deleteEventRecord.id}] does not exist, so cannot be deleted.`,
    });
  }

  if (isNewerVersion(deleteEventRecord, currentRecord)) {
    await deleteEvent(deleteEventRecord.id, deleteEventRecord.venue.id);
  } else {
    logger.info({
      message: `Event record with id: [${deleteEventRecord.id}] is not newer than current stored record, so will not be overwritten.`,
    });
  }
}

const isNewerVersion = (newOffer: EventOffer, currentOffer: EventOffer): boolean =>
  new Date(newOffer.updatedAt) >= new Date(currentOffer.updatedAt);
