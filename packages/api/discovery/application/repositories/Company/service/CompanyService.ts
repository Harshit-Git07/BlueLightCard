import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Company } from '@blc-mono/discovery/application/models/Company';
import { CompanyLocation } from '@blc-mono/discovery/application/models/CompanyLocation';

import { CompanyRepository } from '../CompanyRepository';

import {
  mapCompanyLocationEntityToCompanyLocation,
  mapCompanyLocationToCompanyLocationEntity,
} from './mapper/CompanyLocationMapper';
import { mapCompanyEntityToCompany, mapCompanyToCompanyEntity } from './mapper/CompanyMapper';
import { buildErrorMessage } from './utils/ErrorMessageBuilder';

const logger = new LambdaLogger({ serviceName: 'company-service' });

export async function insertCompany(company: Company): Promise<void> {
  try {
    const companyEntity = mapCompanyToCompanyEntity(company);
    await new CompanyRepository().insert(companyEntity);
    logger.info({ message: `Inserted new Company with id: [${company.id}]` });
  } catch (error) {
    throw new Error(buildErrorMessage(logger, error, `Error occurred inserting new Company with id: [${company.id}]`));
  }
}

export async function deleteCompanyRecords(companyRecords: (CompanyLocation | Company)[]): Promise<void> {
  try {
    const companyRecordEntities = companyRecords.map((record) =>
      record.type === 'company-location'
        ? mapCompanyLocationToCompanyLocationEntity(record)
        : mapCompanyToCompanyEntity(record),
    );
    await new CompanyRepository().batchDelete(companyRecordEntities);
    logger.info({ message: `Deleted Company Records with size: [${companyRecords.length}]` });
  } catch (error) {
    throw new Error(
      buildErrorMessage(
        logger,
        error,
        `Error ocurred batch deleting company records with length: [${companyRecords.length}]`,
      ),
    );
  }
}

export async function insertCompanyLocations(companyLocations: CompanyLocation[]): Promise<void> {
  try {
    const companyLocationEntities = companyLocations.map(mapCompanyLocationToCompanyLocationEntity);
    await new CompanyRepository().batchInsert(companyLocationEntities);
    logger.info({ message: `Batch inserted company locations with size: [${companyLocations.length}]` });
  } catch (error) {
    throw new Error(
      buildErrorMessage(
        logger,
        error,
        `Error occured batch inserting company locations with size: [${companyLocations.length}]`,
      ),
    );
  }
}

export async function getCompanyById(id: string): Promise<Company | undefined> {
  try {
    const result = await new CompanyRepository().retrieveById(id);
    logger.info({ message: `Retrieved Company with id: [${id}]` });
    return result ? mapCompanyEntityToCompany(result) : undefined;
  } catch (error) {
    throw new Error(buildErrorMessage(logger, error, `Error occurred retrieving Company by id: [${id}]`));
  }
}

export async function getCompanyRecordsById(id: string): Promise<(CompanyLocation | Company)[] | undefined> {
  try {
    const results = await new CompanyRepository().retrieveCompanyRecordsById(id);
    logger.info({ message: `Retrieved Company records with id: [${id}]` });
    return results
      ? results.map((result) => {
          return result.type === 'company-location'
            ? mapCompanyLocationEntityToCompanyLocation(result)
            : mapCompanyEntityToCompany(result);
        })
      : undefined;
  } catch (error) {
    throw new Error(buildErrorMessage(logger, error, `Error occurred retrieving Company records by id: [${id}]`));
  }
}

export async function getCompanyLocationsById(id: string): Promise<CompanyLocation[] | undefined> {
  try {
    const results = await new CompanyRepository().retrieveLocationsByCompanyId(id);
    logger.info({ message: `Retrieved Company locations with id: [${id}], results - ${results}` });
    return results ? results.map(mapCompanyLocationEntityToCompanyLocation) : undefined;
  } catch (error) {
    throw new Error(buildErrorMessage(logger, error, `Error occurred retrieving company locations by id: [${id}]`));
  }
}
