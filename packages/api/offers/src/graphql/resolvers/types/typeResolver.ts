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

  constructor(private datasources: DataSource) {
    this.datasources = datasources;
  }

  initialise() {
    this.createBrandHomePageResolver();
    this.createHomePageOffersContainersResolver();
    this.createOfferCompanyResolver();
    this.createOfferTypeResolver();
    this.createTypeLambdaResolver();
  }

  private createBrandHomePageResolver() {
    this.datasources.homePageDS.createResolver('BrandHomePageResolver', {
      typeName: 'Brand',
      fieldName: 'homePage',
      requestMappingTemplate: MappingTemplate.fromFile(`${this.TEMPLATE_BASE_PATH}/brandHomePageRequest.vtl`),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });
  }

  private createHomePageOffersContainersResolver() {
    this.datasources.offersContainerDS.createResolver('HomePageOffersContainersResolver', {
      typeName: 'HomePage',
      fieldName: 'offersContainers',
      requestMappingTemplate: MappingTemplate.fromFile(
        `${this.TEMPLATE_BASE_PATH}/homePageOffersContainersRequest.vtl`,
      ),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });
  }

  private createOfferCompanyResolver() {
    this.datasources.companyDS.createResolver('OfferCompanyResolver', {
      typeName: 'Offer',
      fieldName: 'company',
      requestMappingTemplate: MappingTemplate.fromFile(`${this.TEMPLATE_BASE_PATH}/offerCompanyRequest.vtl`),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });
  }

  private createOfferTypeResolver() {
    this.datasources.offerTypeDS.createResolver('OfferTypeResolver', {
      typeName: 'Offer',
      fieldName: 'offerType',
      requestMappingTemplate: MappingTemplate.fromFile(`${this.TEMPLATE_BASE_PATH}/offerTypeRequest.vtl`),
      responseMappingTemplate: MappingTemplate.dynamoDbResultItem(),
    });
  }

  private createTypeLambdaResolver() {
    const fields = [
      { typeName: 'OffersContainer', fieldName: 'offers' },
      { typeName: 'Offer', fieldName: 'brands' },
      { typeName: 'Offer', fieldName: 'categories' },
    ];
    fields.forEach(({ typeName, fieldName }) =>
      this.datasources.typeLambdaDS.createResolver(`${typeName}${fieldName}Resolver`, {
        typeName,
        fieldName,
      }),
    );
  }
}
