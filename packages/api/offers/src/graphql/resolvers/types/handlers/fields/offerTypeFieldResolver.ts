import { OfferTypeRepository } from '../../../../../repositories/offerTypeRepository'
import { Logger } from '@aws-lambda-powertools/logger'

export async function getOfferTypes(offerTypeIds: any[] | undefined, offerTypeTable: string, logger: Logger) {
  if (!offerTypeIds || offerTypeIds.length === 0) {
    logger.error('OfferType Ids is null');
    throw new Error('OfferType Ids is null');
  }
  const offerTypeData = await new OfferTypeRepository(offerTypeTable).batchGetByIds(offerTypeIds);
  if (!offerTypeData.Responses) {
    logger.error('OfferType data not found in OfferType table with given ids', { offerTypeIds });
    throw new Error('OfferType data not found in OfferType table');
  }
 return  offerTypeData.Responses[`${offerTypeTable}`];
}
