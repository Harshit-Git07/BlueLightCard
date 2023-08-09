import { MappingTemplate } from 'aws-cdk-lib/aws-appsync';
import { DataSource } from '../../dataSources';
import { IResolver } from '../iResolver';

/**
 * This class is creating the query resolvers
 * Any Type Query should be added here
 * @param datasources - The datasources to use in the resolvers
 */ 
export class QueryResolver implements IResolver {
  private readonly TEMPLATE_BASE_PATH = './packages/api/offers/src/graphql/resolvers/queries/templates';

  constructor(private datasources: DataSource) {
    this.datasources = datasources;
  }

  initialise() {
    this.getHomePageByBrandIDResolver();
    this.getOfferByIdResolver();
    this.getOffersByTypeResolver();
  }

  private getHomePageByBrandIDResolver() {
    this.datasources.brandDS.createResolver('GetHomePagesByBrandID', {
      typeName: 'Query',
      fieldName: 'getBrand',
      requestMappingTemplate: MappingTemplate.dynamoDbGetItem('id', 'brandID'),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });
  }

  private getOfferByIdResolver() {
    this.datasources.offerDS.createResolver('GetOfferById', {
      typeName: 'Query',
      fieldName: 'getOffer',
      requestMappingTemplate: MappingTemplate.dynamoDbGetItem('id', 'offerId'),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });
  }

  private getOffersByTypeResolver() {
    this.datasources.offerDS.createResolver('GetOffersByType', {
      typeName: 'Query',
      fieldName: 'getOffersByType',
      requestMappingTemplate: MappingTemplate.fromFile(`${this.TEMPLATE_BASE_PATH}/getOffersByTypeRequest.vtl`),
      responseMappingTemplate: MappingTemplate.fromFile(`${this.TEMPLATE_BASE_PATH}/getOffersByTypeResponse.vtl`),
    });
  }
}
