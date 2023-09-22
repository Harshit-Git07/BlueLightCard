import { MappingTemplate } from 'aws-cdk-lib/aws-appsync';
import { DataSource } from '../../dataSources';
import { IResolver } from '../iResolver';

/**
 * This class creates the resolvers for the types in the schema.
 * You can add VTL templates to the request and response mapping templates.
 * You can add Lambda Resolver.
 * @param datasources - The data sources
 */
export class TypeResolver implements IResolver {
  private readonly TEMPLATE_BASE_PATH = './packages/api/offers/src/graphql/resolvers/types/templates';

  constructor(private dataSources: DataSource) {
    this.dataSources = dataSources;
  }

  initialise() {
    this.createOfferCompanyResolver();
    // this.createTypeLambdaResolver();
  }

  private createOfferCompanyResolver() {
    this.dataSources.companyDS.createResolver('OfferCompanyResolver', {
      typeName: 'Offer',
      fieldName: 'company',
      requestMappingTemplate: MappingTemplate.fromFile(`${this.TEMPLATE_BASE_PATH}/offerCompanyRequest.vtl`),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });
  }

  // private createTypeLambdaResolver() {
  //   const fields = [
  //     { typeName: 'Offer', fieldName: 'brands' },
  //     { typeName: 'Offer', fieldName: 'categories' },
  //   ];
  //   fields.forEach(({ typeName, fieldName }) =>
  //     this.dataSources.typeLambdaDS.createResolver(`${typeName}${fieldName}Resolver`, {
  //       typeName,
  //       fieldName,
  //     }),
  //   );
  // }
}
