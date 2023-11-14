import { Logger } from '@aws-lambda-powertools/logger';
import { CompanyTagConnectionRepository } from '../repositories/companyTagConnectionRepository';
import { CompanyTag } from '../models/companyTag';

export class CompanyTagService {
  private companyTagConnectionRepository: CompanyTagConnectionRepository;
  constructor(tableName: string, private readonly logger: Logger) {
    this.companyTagConnectionRepository = new CompanyTagConnectionRepository(tableName);
  }

  public async findCompanyTagConnectionsByCompanyId(companyId: string) {
    try {
      const result = await this.companyTagConnectionRepository.getByCompanyId(companyId);
      if (result && result.Items && result.Count && result.Count > 0) {
        return result.Items as CompanyTag[];
      } else {
        return [];
      }
    } catch (error) {
      this.logger.error('findCompanyTagConnectionsByCompanyId failed', { error });
      throw error;
    }
  }
}
