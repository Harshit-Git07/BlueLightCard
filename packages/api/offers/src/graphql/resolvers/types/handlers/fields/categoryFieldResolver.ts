import { CategoryRepository } from '../../../../../repositories/categoryRepository'
import { Logger } from '@aws-lambda-powertools/logger'

export async function getCategories(categoryIds: any[] | undefined, categoryTable: string, logger: Logger) {

  if (!categoryIds || categoryIds.length === 0) {
    logger.error('Category Ids is null');
    throw new Error('Category Ids is null');
  }
  const categoryRepository = new CategoryRepository(categoryTable);
  const categoryData = await categoryRepository.batchGetByIds(categoryIds);
  if (!categoryData.Responses) {
    logger.error('Category data not found in category table with given ids', { categoryIds });
    throw new Error('Category data not found in category table');
  }
  return categoryData.Responses[`${categoryTable}`];

}
