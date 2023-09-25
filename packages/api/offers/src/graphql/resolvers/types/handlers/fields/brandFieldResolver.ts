import { BrandRepository } from '../../../../../repositories/brandRepository'
import { Logger } from '@aws-lambda-powertools/logger'

export async function getBrands(brandIds: any[] | undefined, brandTable: string, logger: Logger) {
  if (!brandIds || brandIds.length === 0) {
    logger.error('Brand Ids is null');
    throw new Error('Brand Ids is null');
  }
  const brandData = await new BrandRepository(brandTable).batchGetByIds(brandIds);

  if (!brandData.Responses) {
    logger.error('Brand data not found in brand table with given ids', { brandIds });
    throw new Error('Brand data not found in brand table');
  }
 return  brandData.Responses[`${brandTable}`];
}
