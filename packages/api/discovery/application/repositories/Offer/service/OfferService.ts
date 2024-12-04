import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Offer } from '@blc-mono/discovery/application/models/Offer';
import { buildErrorMessage } from '@blc-mono/discovery/application/repositories/Company/service/utils/ErrorMessageBuilder';

import { OfferRepository } from '../OfferRepository';

import { mapOfferEntityToOffer, mapOfferToOfferEntity } from './mapper/OfferMapper';

const logger = new LambdaLogger({ serviceName: 'offer-service' });

type OfferReference = { id: string; companyId: string };

export async function insertOffer(offer: Offer): Promise<void> {
  try {
    const offerEntity = mapOfferToOfferEntity(offer);
    await new OfferRepository().insert(offerEntity);
    logger.info({ message: `Inserted Offer with id: [${offer.id}]` });
  } catch (error) {
    throw new Error(buildErrorMessage(logger, error, `Error occurred inserting new Offer with id: [${offer.id}]`));
  }
}

export async function insertOffers(offers: Offer[]): Promise<void> {
  try {
    const offerEntities = offers.map(mapOfferToOfferEntity);
    await new OfferRepository().batchInsert(offerEntities);
    logger.info({ message: `Inserted Offers as batch, amount: [${offers.length}]` });
    return;
  } catch (error) {
    throw new Error(
      buildErrorMessage(logger, error, `Error occurred inserting Offers as batch, amount: [${offers.length}]`),
    );
  }
}

export async function deleteOffer(id: string, companyId: string): Promise<void> {
  try {
    await new OfferRepository().delete(id, companyId);
    logger.info({ message: `Deleted Offer with id: [${id}]` });
  } catch (error) {
    throw new Error(buildErrorMessage(logger, error, `Error occurred deleting Offer with id: [${id}]`));
  }
}

export async function getOfferById(id: string, companyId: string): Promise<Offer | undefined> {
  try {
    const result = await new OfferRepository().retrieveById(id, companyId);
    if (!result) {
      return;
    }
    logger.info({ message: `Retrieved Offer with id: [${id}]` });
    return mapOfferEntityToOffer(result);
  } catch (error) {
    throw new Error(buildErrorMessage(logger, error, `Error occurred retrieving Offer by id: [${id}]`));
  }
}

export async function getNonLocalOffers(): Promise<Offer[]> {
  try {
    const result = await new OfferRepository().getNonLocal();
    logger.info({ message: `Retrieved non local offers. Size [${result?.length}]` });
    return result ? result.map(mapOfferEntityToOffer) : [];
  } catch (error) {
    throw new Error(buildErrorMessage(logger, error, 'Error occurred retrieving non local offers'));
  }
}

export async function getOffersByCompany(companyId: string): Promise<Offer[]> {
  try {
    const result = await new OfferRepository().retrieveByCompanyId(companyId);
    logger.info({ message: `Retrieved Offers for a Company with id: [${companyId}]` });
    return result ? result.map(mapOfferEntityToOffer) : [];
  } catch (error) {
    throw new Error(
      buildErrorMessage(logger, error, `Error occurred retrieving Offers for a Company by companyId: [${companyId}]`),
    );
  }
}

export async function getOffersByIds(ids: OfferReference[]): Promise<Offer[]> {
  try {
    const result = await new OfferRepository().retrieveByIds(removeDuplicateOffers(ids));
    logger.info({ message: `Retrieved Offers by ids. Size [${result.length}]` });
    return result.map(mapOfferEntityToOffer);
  } catch (error) {
    throw new Error(buildErrorMessage(logger, error, `Error occurred retrieving Offers by ids`));
  }
}

const removeDuplicateOffers = (offers: OfferReference[]): OfferReference[] => {
  const uniqueOffers = new Map<string, OfferReference>();
  offers.forEach((offer) => {
    uniqueOffers.set(offer.id, offer);
  });
  return Array.from(uniqueOffers.values());
};
