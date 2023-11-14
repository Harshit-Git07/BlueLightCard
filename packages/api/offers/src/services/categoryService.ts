import { CategoryRepository } from '../repositories/categoryRepository';
import { Category } from '../models/category';
import { Logger } from '@aws-lambda-powertools/logger';
import { CATEGORY_TYPES } from '../utils/global-constants';

export class CategoryService {
  private categoryRepository: CategoryRepository;
  constructor(private readonly tableName: string, private readonly logger: Logger) {
    this.categoryRepository = new CategoryRepository(tableName);
  }

  public async getCategoryIdByLegacyId(legacyId: string) {
    try {
      const result = await this.categoryRepository.getByLegacyIdAndType(legacyId, CATEGORY_TYPES.COMPANY);
      if (result && result.Items && result.Items.length > 0) {
        return result.Items[0].id;
      } else {
        return undefined;
      }
    } catch (error) {
      this.logger.error('Get category by legacyId failed', { error });
      throw error;
    }
  }

  public async createCategoriesIfNotExists(categories: Category[]) {
    const categoriesList: Category[] = [];

    for (const category of categories) {
      const result = await this.categoryRepository.getByLegacyIdAndType(category.legacyId, category.type);
      if(result && result.Items && result.Items.length > 0) {
        categoriesList.push(result.Items[0] as Category);
      } else {
        categoriesList.push(await this.createNewCategory(category));
      }
    }
    return categoriesList;
  }

  private async createNewCategory(category: Category) {
    try {
      await this.categoryRepository.save(category);
      return category;
    } catch (error) {
      throw error
    }
  }
}
