import 'reflect-metadata';
import { AppSyncResolverEvent } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { OfferCategoriesAndCompaniesResolver } from './homepage/resolveGetAllCompaniesAndCategoriesByBrandId';
import { OfferMenusByBrandIdResolver } from './homepage/resolveGetOfferMenusByBrandId';
import { BannersByBrandIdAndTypeResolver } from './homepage/resolveGetBannersByBrandIdAndType';
import { OfferHomepageRepository } from '../../../../repositories/offersHomepageRepository';
import { BannerRepository } from '../../../../repositories/bannerRepository';
import { CompanyBrandConnectionRepository } from '../../../../repositories/companyBrandConnectionRepository';
import { CompanyRepository } from '../../../../repositories/companyRepository';
import { AllCompaniesByBrandIdResolver } from './offersPage/resolveAllCompaniesByBrandId';

const logger = new Logger({ serviceName: `queryLambdaResolver`, logLevel: 'DEBUG' });
const offerHomePageTableName = process.env.OFFER_HOMEPAGE_TABLE as string;
const bannerTableName = process.env.BANNER_TABLE as string;
const companyBrandConnectionTableName = process.env.COMPANY_BRAND_CONNECTION_TABLE as string;
const companyTableName = process.env.COMPANY_TABLE as string;

// Create repos here
const offerHomepageRepository = new OfferHomepageRepository(offerHomePageTableName);
const bannerRepository = new BannerRepository(bannerTableName);
const companyBrandConnectionRepository = new CompanyBrandConnectionRepository(companyBrandConnectionTableName);
const companyRepository = new CompanyRepository(companyTableName);

// Add new resolvers here
const offerCategoriesAndCompaniesResolver = new OfferCategoriesAndCompaniesResolver(
  offerHomePageTableName,
  offerHomepageRepository,
  logger,
);
const getOfferMenusByBrandIdResolver = new OfferMenusByBrandIdResolver(
  offerHomePageTableName,
  offerHomepageRepository,
  logger,
);
const getBannersByBrandAndTypeResolver = new BannersByBrandIdAndTypeResolver(bannerRepository, logger);
const getAllCompaniesByBrandIdResolver = new AllCompaniesByBrandIdResolver(
  companyTableName,
  companyRepository,
  companyBrandConnectionRepository,
  logger,
);

class ResolverHandler {
  private resolvers: Map<string, (event: AppSyncResolverEvent<any>) => Promise<any>>;

  constructor(private event: AppSyncResolverEvent<any>) {
    logger.info('ResolverHandler Started');

    // Add entry for new resolver here
    this.resolvers = new Map<string, (event: AppSyncResolverEvent<any>) => Promise<any>>([
      [
        'Query:getCategoriesAndCompaniesByBrandId',
        offerCategoriesAndCompaniesResolver.handler.bind(offerCategoriesAndCompaniesResolver),
      ],
      ['Query:getOfferMenusByBrandId', getOfferMenusByBrandIdResolver.handler.bind(getOfferMenusByBrandIdResolver)],
      ['Query:getBanners', getBannersByBrandAndTypeResolver.handler.bind(getBannersByBrandAndTypeResolver)],
      [
        'Query:getAllCompaniesByBrandId',
        getAllCompaniesByBrandIdResolver.handler.bind(getAllCompaniesByBrandIdResolver),
      ],
    ]);
  }

  async handle() {
    logger.info('event handler', { event: this.event });
    const resolverKey = `${this.event.info.parentTypeName}:${this.event.info.fieldName}`;
    const resolver = this.resolvers.get(resolverKey);
    if (resolver) {
      return await resolver(this.event);
    } else {
      throw new Error(`No resolver defined for ${resolverKey}`);
    }
  }
}

export const handler = async (event: AppSyncResolverEvent<any>) => {
  const resolver = new ResolverHandler(event);
  return await resolver.handle();
};
