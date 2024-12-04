import { isBefore } from 'date-fns';

import { LambdaLogger } from '@blc-mono/core/utils/logger';
import { Company } from '@blc-mono/discovery/application/models/Company';
import { CompanyLocation, CompanyLocationEvent } from '@blc-mono/discovery/application/models/CompanyLocation';
import {
  getCompanyById,
  insertCompanyLocations,
} from '@blc-mono/discovery/application/repositories/Company/service/CompanyService';

import { handleCompanyLocationsUpdateToCompanies } from './handleCompanyLocationsUpdateToCompanies';

const logger = new LambdaLogger({ serviceName: 'company-location-event-handler' });

export async function handleCompanyLocationsUpdated(companyLocationEvent: CompanyLocationEvent) {
  const companyRecord = await getCompanyById(companyLocationEvent.companyId);
  if (!companyRecord || !isBefore(new Date(companyLocationEvent.updatedAt), new Date(companyRecord.updatedAt))) {
    await insertCompanyLocations(companyLocationEvent.locations);
    logger.info({ message: `Inserted company locations with size: [${companyLocationEvent.locations.length}]` });
    if (companyRecord) {
      await handleCompanyLocationsUpdateToCompanies(companyRecord);
    }
  }
}

export const isAllCompanyLocationBatchesSaved = (companyLocations: CompanyLocation[]) => {
  if (companyLocations.length === 0) {
    return false;
  }
  const batchIndices = new Set(companyLocations.map((location) => location.batchIndex));
  return batchIndices.size === companyLocations[0].totalBatches;
};

export function sortCurrentStoredCompanyLocationEvents(
  currentStoredCompanyLocations: CompanyLocation[],
  companyRecord: Company,
) {
  return currentStoredCompanyLocations.reduce(
    (locations, location) => {
      if (isBefore(new Date(location.updatedAt), new Date(companyRecord.updatedAt))) {
        locations.oldEvents.push(location);
      } else {
        locations.currentEvents.push(location);
      }
      return locations;
    },
    { oldEvents: [] as CompanyLocation[], currentEvents: [] as CompanyLocation[] },
  );
}
