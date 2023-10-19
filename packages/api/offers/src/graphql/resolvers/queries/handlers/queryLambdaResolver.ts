import { AppSyncResolverEvent } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { OfferCategoriesAndCompaniesResolver } from './homepage/resolveGetAllCompaniesAndCategoriesByBrandId';
import { OfferMenusByBrandIdResolver } from './homepage/resolveGetOfferMenusByBrandId';
import { BannersByBrandIdAndTypeResolver } from './homepage/resolveGetBannersByBrandIdAndType';
import { OfferHomepageRepository } from '../../../../repositories/offersHomepageRepository';
import { BannerRepository } from '../../../../repositories/bannerRepository';
import { CacheService } from '../../../../services/CacheService';

class ResolverHandler {
  private resolvers: Map<string, (event: AppSyncResolverEvent<any>) => Promise<any>>;

  private logger = new Logger({ serviceName: `queryLambdaResolver` });

  constructor(private event: AppSyncResolverEvent<any>) {
    this.logger.info('ResolverHandler Started');
    const brandId = getBrandId(event, this.logger);

    const cacheService = new CacheService(process.env.STAGE as string, this.logger);

    const bannerTableName = process.env.BANNER_TABLE as string;
    const offerHomePageTableName = process.env.OFFER_HOMEPAGE_TABLE as string;

    const offerHomepageRepository = new OfferHomepageRepository(offerHomePageTableName);

    const bannerRepository = new BannerRepository(bannerTableName);

    // Add new resolvers here
    const offerCategoriesAndCompaniesResolver = new OfferCategoriesAndCompaniesResolver(brandId, offerHomePageTableName, offerHomepageRepository, this.logger, cacheService);

    const getOfferMenusByBrandIdResolver = new OfferMenusByBrandIdResolver(brandId, offerHomePageTableName, offerHomepageRepository, this.logger, cacheService);

    const getBannersByBrandAndTypeResolver = new BannersByBrandIdAndTypeResolver(brandId, bannerRepository, this.logger, cacheService)

    // Add entry for new resolver here
    this.resolvers = new Map<string, (event: AppSyncResolverEvent<any>) => Promise<any>>([
      ['Query:getCategoriesAndCompaniesByBrandId', offerCategoriesAndCompaniesResolver.handler.bind(offerCategoriesAndCompaniesResolver)],
      ['Query:getOfferMenusByBrandId', getOfferMenusByBrandIdResolver.handler.bind(getOfferMenusByBrandIdResolver)],
      ['Query:getBannersByBrandAndType', getBannersByBrandAndTypeResolver.handler.bind(getBannersByBrandAndTypeResolver)],
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