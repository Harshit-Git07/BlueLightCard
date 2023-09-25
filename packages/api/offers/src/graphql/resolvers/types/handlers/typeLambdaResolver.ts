import { AppSyncResolverEvent } from 'aws-lambda';
import { Logger } from '@aws-lambda-powertools/logger';
import { CompanyFieldsResolver } from './companyFieldsResolver'
import { OfferFieldsResolver } from './offerFieldsResolver'
const logger = new Logger({ serviceName: `typeLambdaResolver` });

const brandTable = process.env.BRAND_TABLE as string;
const categoryTable: string = process.env.CATEGORY_TABLE as string;

class ResolverHandler {
  private resolver: Map<string, () => Promise<any>> ;

  constructor (private event: AppSyncResolverEvent<any>) {
    const offerFieldsResolver = new OfferFieldsResolver(event.source?.id, categoryTable, brandTable, logger)
    const companyFieldsResolver = new CompanyFieldsResolver(event.source?.id, categoryTable, brandTable, logger)
    this.resolver = new Map<string, () => Promise<any>>([
      ['Offer:categories', offerFieldsResolver.resolveCategories.bind(offerFieldsResolver)],
      ['Offer:brands', offerFieldsResolver.resolveBrands.bind(offerFieldsResolver)],
      ['Offer:types', offerFieldsResolver.resolveTypes.bind(offerFieldsResolver)],
      ['Company:categories', companyFieldsResolver.resolveCategories.bind(companyFieldsResolver)],
      ['Company:brands', companyFieldsResolver.resolveBrands.bind(companyFieldsResolver)],
    ]);
  }

  async handle () {
    const resolverKey = `${this.event.info.parentTypeName}:${this.event.info.fieldName}`;
    const resolver = this.resolver.get(resolverKey);
    if (resolver) {
      return await resolver()
    } else {
      logger.error('Resolver not found', { resolverKey });
      throw new Error(`Resolver ${resolverKey} not found.`);
    }
  }
}

export const handler = async (event: AppSyncResolverEvent<any>) => {
  logger.info('event handler', { event });

  const resolver = new ResolverHandler(event);
  return await resolver.handle();
};


