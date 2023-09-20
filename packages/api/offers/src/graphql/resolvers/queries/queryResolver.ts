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
    this.getBannersByBrandAndTypeResolver();
    this.createQueryLambdaResolver();
  }

  private getBannersByBrandAndTypeResolver() {
    this.dataSources.bannersDS.createResolver('GetBannersByBrandAndType', {
      typeName: 'Query',
      fieldName: 'getBannersByBrandAndType',
      requestMappingTemplate: MappingTemplate.fromFile(`${this.TEMPLATE_BASE_PATH}/getBannersByBrandAndTypeRequest.vtl`),
      responseMappingTemplate: MappingTemplate.fromFile(`${this.TEMPLATE_BASE_PATH}/getBannersByBrandAndTypeResponse.vtl`),
    })
  }

  private createQueryLambdaResolver() {
    const fields = [{ typeName: 'Query', fieldName: 'getOfferMenusByBrandId' }];
    fields.forEach(({ typeName, fieldName }) =>
      this.dataSources.queryLambdaDS.createResolver(`${typeName}${fieldName}Resolver`, {
        typeName,
        fieldName,
      }),
    );
  }
}
