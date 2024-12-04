import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Company } from '@blc-mono/discovery/application/models/Company';
import { Offer } from '@blc-mono/discovery/application/models/Offer';
import {
  getCompanyById,
  insertCompany,
} from '@blc-mono/discovery/application/repositories/Company/service/CompanyService';
import { updateOfferInMenus } from '@blc-mono/discovery/application/repositories/Menu/service/MenuService';
import {
  getOffersByCompany,
  insertOffers,
} from '@blc-mono/discovery/application/repositories/Offer/service/OfferService';

import { handleCompanyLocationsUpdateToCompanies } from './handleCompanyLocationsUpdateToCompanies';

const logger = new LambdaLogger({ serviceName: 'company-event-handler' });

export async function handleCompanyUpdated(newCompanyRecord: Company): Promise<void> {
  const currentCompanyRecord = await getCompanyById(newCompanyRecord.id);

  if (!currentCompanyRecord || isNewerCompanyRecordVersion(newCompanyRecord, currentCompanyRecord)) {
    const result = await handleCompanyLocationsUpdateToCompanies(newCompanyRecord);
    if (!result.companyRecordUpdated) {
      await updateCompanyInCompanyAndOffers(newCompanyRecord);
    }
  } else {
    logger.info({
      message: `Company record with id: [${newCompanyRecord.id}] is not newer than current stored record, so will not be overwritten.`,
    });
  }
}

const isNewerCompanyRecordVersion = (newCompanyRecord: Company, currentCompanyRecord: Company): boolean => {
  return new Date(newCompanyRecord.updatedAt) >= new Date(currentCompanyRecord.updatedAt);
};

export async function updateCompanyInCompanyAndOffers(newCompanyRecord: Company): Promise<void> {
  await insertCompany(newCompanyRecord);

  const currentOfferRecords = await getOffersByCompany(newCompanyRecord.id);

  const updatedOfferRecords = updateOffersWithNewCompanyDetails(currentOfferRecords, newCompanyRecord);

  if (updatedOfferRecords.length > 0) {
    await insertOffers(updatedOfferRecords);
    updatedOfferRecords.forEach(async (newOfferRecord) => {
      await updateOfferInMenus(newOfferRecord);
    });
  }
}

function updateOffersWithNewCompanyDetails(offers: Offer[], newCompanyRecord: Company): Offer[] {
  return offers.map((offer) => {
    if (isNewerCompanyRecordVersion(newCompanyRecord, offer.company)) {
      return {
        ...offer,
        company: newCompanyRecord,
      };
    }

    return offer;
  });
}
