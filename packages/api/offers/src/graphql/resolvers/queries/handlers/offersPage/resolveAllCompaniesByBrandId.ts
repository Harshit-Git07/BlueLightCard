import { Logger } from '@aws-lambda-powertools/logger';
import { CompanyRepository } from 'src/repositories/companyRepository';
import { CompanyBrandConnectionRepository } from 'src/repositories/companyBrandConnectionRepository';
import { AppSyncResolverEvent } from 'aws-lambda';
import { validateBrand } from '../../../../../utils/validation';

export class AllCompaniesByBrandIdResolver {
  constructor(
    private companyTableName: string,
    private companiesRepository: CompanyRepository,
    private companyBrandConnectionRepository: CompanyBrandConnectionRepository,
    private logger: Logger,
  ) {
    this.companyTableName = companyTableName;
    this.companiesRepository = companiesRepository;
    this.companyBrandConnectionRepository = companyBrandConnectionRepository;
    this.logger = logger;
  }

  async handler(event: AppSyncResolverEvent<any>) {
    this.logger.info('All companies resolver started');
    const brandId = event.arguments?.brandId;

    if (!validateBrand(brandId)) {
      this.logger.error('brandId is required', { brandId });
      throw new Error('brandId is required');
    }

    let data: any;

    // Pull in all id's for companies via the brandId from the companiesBrandConnection
    const companyIdsQuery = await this.companyBrandConnectionRepository.getByBrandId(brandId);

    this.logger.info('companyIdsQuery', { companyIdsQuery });
    if (!companyIdsQuery || !companyIdsQuery.Items) {
      this.logger.error('No categories or companies found for brandId', { brandId: brandId });
      throw new Error(`No categories or companies found for brandId ${brandId}`);
    }

    const companyIds = companyIdsQuery.Items.map((item) => item.companyId);
    this.logger.info('companyIds', { companyIds });
    if (!companyIds || companyIds.length == 0) {
      return [];
    }

    // Batch get all companies via the ids from the previous step
    const companies = await this.companiesRepository.batchGetByIds(companyIds);
    this.logger.info('companies', { companies });

    if (!(companies.Responses && companies.Responses[this.companyTableName])) {
      this.logger.error('No companies found for brandId', { brandId: brandId });
      throw new Error(`No companies found for brandId ${brandId}`);
    }

    data = companies.Responses[this.companyTableName];

    this.logger.info('data', { data });
    return data;
  }
}
