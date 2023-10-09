import { AppSyncResolverEvent } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { OfferCategoriesAndCompaniesResolver } from './homepage/resolveGetAllCompaniesAndCategoriesByBrandId';
import { OfferMenusByBrandIdResolver } from './homepage/resolveGetOfferMenusByBrandId';
import { OfferHomepageRepository } from '../../../../repositories/offersHomepageRepository';

class ResolverHandler {
  private resolvers: Map<string, (event: AppSyncResolverEvent<any>) => Promise<any>>;

  private logger = new Logger({ serviceName: `queryLambdaResolver` });

  constructor(private event: AppSyncResolverEvent<any>) {
    this.logger.info('ResolverHandler Started');
    const brandId = getBrandId(event, this.logger);
    const tableName = process.env.OFFER_HOMEPAGE_TABLE as string;

    const offerHomepageRepository = new OfferHomepageRepository(tableName);

    // Add new resolvers here
    const offerCategoriesAndCompaniesResolver = new OfferCategoriesAndCompaniesResolver(brandId, tableName, offerHomepageRepository, this.logger);
    const getOfferMenusByBrandIdResolver = new OfferMenusByBrandIdResolver(brandId, tableName, offerHomepageRepository, this.logger);

    // Add entry for new resolver here
    this.resolvers = new Map<string, (event: AppSyncResolverEvent<any>) => Promise<any>>([
      ['Query:getCategoriesAndCompaniesByBrandId', offerCategoriesAndCompaniesResolver.handler.bind(offerCategoriesAndCompaniesResolver)],
      ['Query:getOfferMenusByBrandId', getOfferMenusByBrandIdResolver.handler.bind(getOfferMenusByBrandIdResolver)],
    ]);
  }

  async handle () {
    this.logger.info('event handler', { event: this.event });
    const resolverKey = `${this.event.info.parentTypeName}:${this.event.info.fieldName}`;
    const resolver = this.resolvers.get(resolverKey);
    if (resolver) {
      return await resolver(this.event);
    } else {
      throw new Error(`No resolver defined for ${resolverKey}`);
    }
  };
}

export const handler = async (event: AppSyncResolverEvent<any>) => {
  const resolver = new ResolverHandler(event);
  return await resolver.handle();
};

const getBrandId = (event: AppSyncResolverEvent<any>, logger?: Logger) => {
  const brandId = event.arguments?.brandId;
  
  if (!brandId) {
    if(logger) logger.error('brandId is required', { brandId });
    throw new Error('brandId is required');
  }

  return brandId;
}