import { Logger } from '@aws-lambda-powertools/logger';
import {RecommendedCompaniesRepository} from "../repositories/recommendedCompaniesRepository";

export class RecommendedCompaniesService {
  private recommendedCompaniesRepository: RecommendedCompaniesRepository;

  constructor(private readonly tableName: string, private readonly logger: Logger) {
    this.recommendedCompaniesRepository = new RecommendedCompaniesRepository(tableName);
  }

  public async getById(memberId: string) {
    try {
      const result = await this.recommendedCompaniesRepository.getById(memberId);
      if (result && result.Item) {
        return result.Item;
      } else {
        return undefined;
      }
    } catch (error) {
      this.logger.error('Get recommended company by member ID failed', {error});
      throw error;
    }
  }
}
