import { LambdaLogger } from '@blc-mono/core/utils/logger/lambdaLogger';
import { Company } from '@blc-mono/discovery/application/models/Company';

import { CompanyRepository } from '../CompanyRepository';

import { mapCompanyEntityToCompany, mapCompanyToCompanyEntity } from './mapper/CompanyMapper';
import { buildErrorMessage } from './utils/ErrorMessageBuilder';

const logger = new LambdaLogger({ serviceName: 'company-service' });

export async function insertCompany(company: Company): Promise<Company | undefined> {
  try {
    const companyEntity = mapCompanyToCompanyEntity(company);
    logger.info({ message: `Inserting new Company with id: [${company.id}]` });
    const result = await new CompanyRepository().insert(companyEntity);
    logger.info({ message: `Inserted new Company with id: [${company.id}]` });
    return result ? mapCompanyEntityToCompany(result) : undefined;
  } catch (error) {
    throw new Error(buildErrorMessage(logger, error, `Error occurred inserting new Company with id: [${company.id}]`));
  }
}

export async function getCompanyById(id: string): Promise<Company | undefined> {
  try {
    logger.info({ message: `Retrieving Company by id: [${id}]` });
    const result = await new CompanyRepository().retrieveById(id);
    logger.info({ message: `Retrieved Company with id: [${id}]` });
    return result ? mapCompanyEntityToCompany(result) : undefined;
  } catch (error) {
    throw new Error(buildErrorMessage(logger, error, `Error occurred retrieving Company by id: [${id}]`));
  }
}
