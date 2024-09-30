import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Offer } from '@blc-mono/discovery/application/models/Offer';
import {
  deleteOffer,
  getOfferById,
  insertOffer,
} from '@blc-mono/discovery/application/repositories/Offer/service/OfferService';

const logger = new LambdaLogger({ serviceName: 'offer-event-handler' });

export async function handleOfferUpdated(newOfferRecord: Offer): Promise<void> {
  const currentOfferRecord = await getOfferById(newOfferRecord.id, newOfferRecord.company.id);

  if (!currentOfferRecord || isNewerOfferVersion(newOfferRecord, currentOfferRecord)) {
    await insertOffer(newOfferRecord);
  } else {
    logger.info({
      message: `Offer record with id: [${newOfferRecord.id}] is not newer than current stored record, so will not be overwritten.`,
    });
  }
}

export async function handleOfferDeleted(deleteOfferRecord: Offer): Promise<void> {
  const currentOfferRecord = await getOfferById(deleteOfferRecord.id, deleteOfferRecord.company.id);

  if (!currentOfferRecord) {
    return logger.info({
      message: `Offer record with id: [${deleteOfferRecord.id}] does not exist, so cannot be deleted.`,
    });
  }

  if (isNewerOfferVersion(deleteOfferRecord, currentOfferRecord)) {
    await deleteOffer(deleteOfferRecord.id, deleteOfferRecord.company.id);
  } else {
    logger.info({
      message: `Offer record with id: [${deleteOfferRecord.id}] is not newer than current stored record, so will not be overwritten.`,
    });
  }
}

const isNewerOfferVersion = (newOffer: Offer, currentOffer: Offer): boolean =>
  new Date(newOffer.updatedAt) >= new Date(currentOffer.updatedAt);
