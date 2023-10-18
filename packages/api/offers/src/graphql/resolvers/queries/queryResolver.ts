import { MappingTemplate } from 'aws-cdk-lib/aws-appsync';
import { DataSource } from '../../dataSources';
import { IResolver } from '../iResolver';

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
    // this.createQueryLambdaResolver();
    this.getOfferByIdResolver();
    this.getCompanyByIdResolver();
  }

  private createQueryLambdaResolver() {
    const fields = [
      { typeName: 'Query', fieldName: 'getOfferMenusByBrandId' },
      { typeName: 'Query', fieldName: 'getCategoriesAndCompaniesByBrandId' },
      { typeName: 'Query', fieldName: 'getBannersByBrandAndType'}
    ];
    fields.forEach(({ typeName, fieldName }) =>
      this.dataSources.queryLambdaDS.createResolver(`${typeName}${fieldName}Resolver`, {
        typeName,
        fieldName,
      }),
    );
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
}
