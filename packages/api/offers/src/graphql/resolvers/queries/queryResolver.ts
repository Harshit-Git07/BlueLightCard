import { MappingTemplate } from 'aws-cdk-lib/aws-appsync';
import { DataSource } from '../../dataSources';
import { IResolver } from '../iResolver';
import { Duration } from 'aws-cdk-lib';

/**
 * This class is creating the query resolvers
 * Any Type Query should be added here
 * @param dataSources - The dataSources to use in the resolvers
 */
export class QueryResolver implements IResolver {
  private readonly TEMPLATE_BASE_PATH = './packages/api/offers/src/graphql/resolvers/queries/templates';

  constructor(private dataSources: DataSource) {
    this.dataSources = dataSources;
  }

  initialise() {
    this.getOfferByIdResolver();
    this.getCompanyByIdResolver();
    this.getAllCompaniesByBrandIdResolver();
    this.getOfferMenusResolver();
    this.getBannersResolver();
    this.getCategoriesAndCompaniesResolver();
  }

  private getOfferByIdResolver() {
    this.dataSources.offerDS.createResolver('GetOfferById', {
      typeName: 'Query',
      fieldName: 'getOfferById',
      requestMappingTemplate: MappingTemplate.dynamoDbGetItem('id', 'id'),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });
  }

  private getCompanyByIdResolver() {
    this.dataSources.companyDS.createResolver('GetCompanyById', {
      typeName: 'Query',
      fieldName: 'getCompanyById',
      requestMappingTemplate: MappingTemplate.dynamoDbGetItem('id', 'id'),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });
  }

  private getCategoriesAndCompaniesResolver() {
    this.dataSources.queryLambdaDS.createResolver('QuerygetCategoriesAndCompaniesByBrandIdResolver', {
      typeName: 'Query',
      fieldName: 'getCategoriesAndCompaniesByBrandId',
      cachingConfig: {
        cachingKeys: [
          '$context.arguments.brandId',
          '$context.arguments.input.isUnder18',
        ],
        ttl: Duration.minutes(60),
      },
    });
  }

  private getBannersResolver() {
    this.dataSources.queryLambdaDS.createResolver('QuerygetBannersResolver', {
      typeName: 'Query',
      fieldName: 'getBanners',
      cachingConfig: {
        cachingKeys: [
          '$context.arguments.input.brandId',
          '$context.arguments.input.type',
          '$context.arguments.input.restriction.organisation',
          '$context.arguments.input.restriction.isUnder18',
        ],
        ttl: Duration.minutes(60),
      },
    });
  }

  private getOfferMenusResolver() {
    this.dataSources.queryLambdaDS.createResolver('QuerygetOfferMenusByBrandIdResolver', {
      typeName: 'Query',
      fieldName: 'getOfferMenusByBrandId',
      cachingConfig: {
        cachingKeys: [
          '$context.arguments.brandId',
          '$context.arguments.input.isUnder18',
          '$context.arguments.input.organisation',
        ],
        ttl: Duration.minutes(15),
      },
    });
  }

  private getAllCompaniesByBrandIdResolver() {
    this.dataSources.queryLambdaDS.createResolver('GetAllCompaniesByBrandId', {
      typeName: 'Query',
      fieldName: 'getAllCompaniesByBrandId',
      cachingConfig: {
        cachingKeys: ['$context.arguments.brandId'],
        ttl: Duration.minutes(60),
      },
    });
  }
}
