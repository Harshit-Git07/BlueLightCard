import { LambdaLogger } from '@blc-mono/core/utils/logger';
import { Company } from '@blc-mono/discovery/application/models/Company';
import {
  deleteCompanyRecords,
  getCompanyLocationsById,
} from '@blc-mono/discovery/application/repositories/Company/service/CompanyService';
import { mapCompanyLocationToLocation } from '@blc-mono/discovery/application/repositories/Company/service/mapper/CompanyMapper';

import { updateCompanyInCompanyAndOffers } from './CompanyEventHandler';
import {
  isAllCompanyLocationBatchesSaved,
  sortCurrentStoredCompanyLocationEvents,
} from './CompanyLocationEventHandler';

const logger = new LambdaLogger({ serviceName: 'company-location-event-handler' });

export async function handleCompanyLocationsUpdateToCompanies(
  companyRecord: Company,
): Promise<{ companyRecordUpdated: boolean }> {
  const currentStoredCompanyLocations = await getCompanyLocationsById(companyRecord.id);
  if (currentStoredCompanyLocations && currentStoredCompanyLocations.length > 0) {
    const locations = sortCurrentStoredCompanyLocationEvents(currentStoredCompanyLocations, companyRecord);

    const updateCompanyRecord = isAllCompanyLocationBatchesSaved(locations.currentEvents);

    if (updateCompanyRecord) {
      logger.info({ message: `All location batches saved, updating company record with id: ${companyRecord.id}` });
      const newCompanyRecordWithLocations: Company = {
        ...companyRecord,
        locations: locations.currentEvents.map(mapCompanyLocationToLocation),
      };
      await updateCompanyInCompanyAndOffers(newCompanyRecordWithLocations);

      if (locations.oldEvents.length > 0) {
        deleteCompanyRecords(locations.oldEvents);
      }
    }
    return { companyRecordUpdated: updateCompanyRecord };
  }
  return { companyRecordUpdated: false };
}
