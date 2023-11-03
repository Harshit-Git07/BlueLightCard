import { CategoryRepository } from '../repositories/categoryRepository';
import { Logger } from '@aws-lambda-powertools/logger';
import { CATEGORY_TYPES } from '../utils/global-constants';

export class CategoryService {
  private categoryRepository: CategoryRepository;
  constructor(private readonly tableName: string, private readonly logger: Logger) {
    this.categoryRepository = new CategoryRepository(tableName);
  }

  public async getCategoryIdByLegacyId(legacyId: string) {
    const result = await this.categoryRepository.getByLegacyIdAndType(legacyId, CATEGORY_TYPES.COMPANY);
    if (result && result.Items && result.Items.length > 0) {
      return result.Items[0].id;
    }
    this.logger.error('Category not found', { legacyId });
    throw new Error(`Category not found: legacyId: ${legacyId}`);
  }
}
