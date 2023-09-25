import { OfferCategoryConnectionRepository } from '../../../../repositories/offerCategoryConnectionRepository'
import { getCategories } from './fields/categoryFieldResolver'
import { getBrands } from './fields/brandFieldResolver'
import { OfferTypeConnectionRepository } from '../../../../repositories/offerTypeConnectionRepository'
import { getOfferTypes } from './fields/offerTypeFieldResolver'
import { Logger } from '@aws-lambda-powertools/logger';
import { OfferBrandConnectionRepository } from '../../../../repositories/offerBrandConnectionRepository'

export class OfferFieldsResolver {
  private readonly offerTypeConnectionTable = process.env.OFFER_TYPE_CONNECTION_TABLE as string;
  private readonly offerCategoryConnectionTable = process.env.OFFER_CATEGORY_CONNECTION_TABLE as string;
  private readonly offerBrandConnectionTable = process.env.OFFER_BRAND_CONNECTION_TABLE as string;
  private readonly offerTypeTable: string = process.env.OFFER_TYPE_TABLE as string;

  constructor (private offerId: string, private categoryTable: string, private brandTable: string, private logger: Logger) {
    logger.info('OfferFieldsResolver Started')
  }

  async resolveCategories () {
    this.logger.info('Offer categories field resolver started')
    const offerCategoryResult = await new OfferCategoryConnectionRepository(this.offerCategoryConnectionTable).getByOfferId(this.offerId);
    if (this.checkIfEmpty(offerCategoryResult.Items)) {
      this.logger.error('Offer categories connection not found for given offer id', { offerId: this.offerId });
      throw new Error('Offer categories connection not found');
    }
    const categoryIds = offerCategoryResult.Items?.map((item) => item.categoryId)
    return await getCategories(categoryIds, this.categoryTable, this.logger);
  }

  async  resolveBrands () {
    this.logger.info('Offer brands field resolver started')
    const offerBrandResult = await new OfferBrandConnectionRepository(this.offerBrandConnectionTable).getByOfferId(this.offerId);
    if (this.checkIfEmpty(offerBrandResult.Items)) {
      this.logger.error('Offer brands connection not found for given offer id', { offerId: this.offerId });
      throw new Error('Offer brands connection not found')
    }
    const brandIds = offerBrandResult.Items?.map((item) => item.brandId)
    return await getBrands(brandIds, this.brandTable, this.logger);
  }

  async resolveTypes () {
    this.logger.info('Offer types field resolver started')
    const offerTypeResult = await new OfferTypeConnectionRepository(this.offerTypeConnectionTable).getByOfferId(this.offerId);
    if (this.checkIfEmpty(offerTypeResult.Items)) {
      this.logger.error('Offer types connection not found for given offer id', { offerId: this.offerId });
      throw new Error('Offer types connection not found')
    }
    const offerTypeIds = offerTypeResult.Items?.map((item) => item.offerTypeId)
    return await getOfferTypes(offerTypeIds, this.offerTypeTable, this.logger)
  }

  private checkIfEmpty (items: any) {
    return items === null || (items != null && items.length === 0)
  }

}
