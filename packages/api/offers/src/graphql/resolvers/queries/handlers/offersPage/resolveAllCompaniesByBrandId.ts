import { Logger } from '@aws-lambda-powertools/logger';
import { CacheService } from "src/services/CacheService";
import { CompanyRepository } from "src/repositories/companyRepository";
import { CompanyBrandConnectionRepository } from "src/repositories/companyBrandConnectionRepository";
import { ONE_DAY } from "../../../../../utils/duration";

export class AllCompaniesByBrandIdResolver {

  private readonly companiesCacheKey = `${this.brandId}-offers-all-companies`;

  constructor(private brandId: string, 
    private companyTableName: string,
    private companiesRepository: CompanyRepository,
    private companyBrandConnectionRepository: CompanyBrandConnectionRepository,
    private logger: Logger, 
    private cacheService: CacheService) 
  {
    this.brandId = brandId;
    this.companyTableName = companyTableName;;
    this.companiesRepository = companiesRepository;
    this.companyBrandConnectionRepository = companyBrandConnectionRepository;
    this.logger = logger;
    this.cacheService = cacheService;
  }

  async handler() {
    this.logger.info("All companies resolver started");

    let data: any;

    // Cache check
    const cache = await this.cacheService.get(this.companiesCacheKey);
    if(cache) {
      this.logger.info('Cache hit for all companies');
      // Map the results from the cache to the expected format
      data = JSON.parse(cache);
    } else {
      this.logger.info('Cache miss for all companies');

      // Pull in all id's for companies via the brandId from the companiesBrandConnection
      const companyIdsQuery = await this.companyBrandConnectionRepository.getByBrandId(this.brandId);
      
      this.logger.info('companyIdsQuery', { companyIdsQuery });
      if (!companyIdsQuery || !companyIdsQuery.Items) {
        this.logger.error('No categories or companies found for brandId', { brandId: this.brandId });
        throw new Error(`No categories or companies found for brandId ${this.brandId}`);
      }

      const companyIds = companyIdsQuery.Items.map((item) => item.companyId);
      this.logger.info('companyIds', { companyIds });
      if(!companyIds || companyIds.length == 0) {
        return [];
      }

      // Batch get all companies via the ids from the previous step
      const companies = await this.companiesRepository.batchGetByIds(companyIds);
      this.logger.info('companies', { companies });

      if(!(companies.Responses && companies.Responses[this.companyTableName])) {
        this.logger.error('No companies found for brandId', { brandId: this.brandId });
        throw new Error(`No companies found for brandId ${this.brandId}`);
      }

      data = companies.Responses[this.companyTableName];
      await this.cacheService.set(this.companiesCacheKey, JSON.stringify(data), ONE_DAY);
    }
    
    this.logger.info('data', { data });
    return data
  }
}