import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Offer } from '@blc-mono/discovery/application/models/Offer';
import { buildErrorMessage } from '@blc-mono/discovery/application/repositories/Company/service/utils/ErrorMessageBuilder';

import { OfferRepository } from '../OfferRepository';

import { mapOfferEntityToOffer, mapOfferToOfferEntity } from './mapper/OfferMapper';

const logger = new LambdaLogger({ serviceName: 'offer-service' });

export async function insertOffer(offer: Offer): Promise<Offer | undefined> {
  try {
    const offerEntity = mapOfferToOfferEntity(offer);
    logger.info({ message: `Inserting new Offer with id: [${offer.id}]` });
    const result = await new OfferRepository().insert(offerEntity);
    logger.info({ message: `Inserted new Offer with id: [${offer.id}]` });
    return result ? mapOfferEntityToOffer(result) : undefined;
  } catch (error) {
    throw new Error(buildErrorMessage(logger, error, `Error occurred inserting new Offer with id: [${offer.id}]`));
  }
}

export async function deleteOffer(id: string, companyId: string): Promise<Offer | undefined> {
  try {
    logger.info({ message: `Deleting Offer with id: [${id}]` });
    const result = await new OfferRepository().delete(id, companyId);
    logger.info({ message: `Deleted Offer with id: [${id}]` });
    return result ? mapOfferEntityToOffer(result) : undefined;
  } catch (error) {
    throw new Error(buildErrorMessage(logger, error, `Error occurred deleting Offer with id: [${id}]`));
  }
}

export async function getOfferById(id: string, companyId: string): Promise<Offer | undefined> {
  try {
    logger.info({ message: `Retrieving Offer by id: [${id}]` });
    const result = await new OfferRepository().retrieveById(id, companyId);
    logger.info({ message: `Retrieved Offer with id: [${id}]` });
    return result ? mapOfferEntityToOffer(result) : undefined;
  } catch (error) {
    throw new Error(buildErrorMessage(logger, error, `Error occurred retrieving Offer by id: [${id}]`));
  }
}

export async function getNonLocalOffers(): Promise<Offer[]> {
  try {
    logger.info({ message: 'Retrieving non local Offers' });
    const result = await new OfferRepository().getNonLocal();
    logger.info({ message: `Retrieved non local offers. Size [${result?.length}]` });
    return result ? result.map(mapOfferEntityToOffer) : [];
  } catch (error) {
    throw new Error(buildErrorMessage(logger, error, 'Error occurred retrieving non local offers'));
  }
}

export async function getOffersByCompany(companyId: string): Promise<Offer[]> {
  try {
    logger.info({ message: `Retrieving Offers for a Company with id: [${companyId}]` });
    const result = await new OfferRepository().retrieveByCompanyId(companyId);
    logger.info({ message: `Retrieved Offers for a Company with id: [${companyId}]` });
    return result ? result.map(mapOfferEntityToOffer) : [];
  } catch (error) {
    throw new Error(
      buildErrorMessage(logger, error, `Error occurred retrieving Offers for a Company by companyId: [${companyId}]`),
    );
  }
}
