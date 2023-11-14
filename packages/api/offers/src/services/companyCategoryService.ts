import { Logger } from '@aws-lambda-powertools/logger';
import { CompanyCategoryConnectionRepository } from '../repositories/companyCategoryConnectionRepository';
import { Company } from '../models/company';
import { CompanyCategory } from '../models/companyCategory';

export class CompanyCategoryService {
  private companyCategoryConnectionRepository: CompanyCategoryConnectionRepository;
  constructor(tableName: string, private readonly logger: Logger) {
    this.companyCategoryConnectionRepository = new CompanyCategoryConnectionRepository(tableName);
  }

  public async getByCompanyIdCategoryId(categoryID: string, companyId: string) {
    try {
      const result = await this.companyCategoryConnectionRepository.getByCompanyIdAndCategoryId(categoryID, companyId);
      if (result && result.Item) {
        return result.Item as CompanyCategory;
      } else {
        return undefined;
      }
    } catch (error) {
      this.logger.error('CompanyCategory Service , getByCompanyIdCategoryId failed', { error });
      throw error;
    }
  }

  public async getByCompanyId(companyId: string) {
    try {
      const result = await this.companyCategoryConnectionRepository.getByCompanyId(companyId);
      if (result && result.Items && result.Count && result.Count > 0) {
        return result.Items as CompanyCategory[];
      } else {
        return undefined;
      }
    } catch (error) {
      this.logger.error('CompanyCategory Service , getByCompanyId failed', { error });
      throw error;
    }
  }
}
