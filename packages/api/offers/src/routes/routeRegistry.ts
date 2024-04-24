import { ApiGatewayV1Api, Stack } from 'sst/constructs';
import { OffersRoutes } from './offers/offerRoutes';
import { ApiGatewayModelGenerator } from '../../../core/src/extensions/apiGatewayExtension';
import { OfferModel } from '../models/offers';
import { Model } from 'aws-cdk-lib/aws-apigateway';
import { DatabaseRoute } from './database/databaseRoute';
import { CompanyRoutes } from './company/companyRoutes';
import { CompanyInfoModel } from 'src/models/companyInfo';
import { isProduction } from '@blc-mono/core/utils/checkEnvironment';
import { IDatabaseAdapter } from '../constructs/database/IDatabaseAdapter';
import { CompanyOfferRoutes } from './company/offers/companyOfferRoutes';
import { CompanyOffersModel } from 'src/models/companyOffers';
import { OffersHomepageRoutes } from './homepage/homepageRoutes';
import { CategoryMenuModel, CompanyMenuModel, OffersHomepageModel } from 'src/models/offersHomepage';
import { Tables } from '../constructs/tables';

/**
 * The RouteRegistry class provides a centralized way to register all routes for the application.
 */
export class RouteRegistry {
  constructor(stack: Stack, api: ApiGatewayV1Api, dynamoTables: Tables, dbAdapter?: IDatabaseAdapter) {
    this.registerAllRoutes(stack, api, dynamoTables, dbAdapter);
  }

  /**
   * Registers all routes for the application.
   *
   * @param {Stack} stack the AWS CDK stack
   * @param {ApiGatewayV1Api} api the API Gateway instance
   * @param dynamoTables the DynamoDB tables
   * @param dbAdapter the database adapter
   */
  private registerAllRoutes(stack: Stack, api: ApiGatewayV1Api, dynamoTables: Tables, dbAdapter?: IDatabaseAdapter) {
    const apiGatewayModelGenerator = new ApiGatewayModelGenerator(api.cdk.restApi);
    const modelMap = this.generateModels(apiGatewayModelGenerator);
    if (!isProduction(stack.stage)) {
      // TODO: Remove this Condition after adding Prod DB
      new DatabaseRoute({
        stack,
        api,
        apiGatewayModelGenerator,
        dbAdapter,
      }).initialiseRoutes();
    }
    new OffersRoutes({
      stack,
      api,
      apiGatewayModelGenerator,
      model: modelMap.get(OfferModel._ModelName)!,
    }).initialiseRoutes();
    new CompanyRoutes({
      stack,
      api,
      apiGatewayModelGenerator,
      model: modelMap.get(CompanyInfoModel._ModelName)!,
    }).initialiseRoutes();
    new CompanyOfferRoutes({
      stack,
      api,
      apiGatewayModelGenerator,
      model: modelMap.get(CompanyOffersModel._ModelName)!,
    }).initialiseRoutes();
    new OffersHomepageRoutes({
      stack,
      api,
      apiGatewayModelGenerator,
      model: {
        [CompanyMenuModel._ModelName]: modelMap.get(CompanyMenuModel._ModelName)!,
        [CategoryMenuModel._ModelName]: modelMap.get(CategoryMenuModel._ModelName)!,
        [OffersHomepageModel._ModelName]: modelMap.get(OffersHomepageModel._ModelName)!,
      },
      dynamoTables,
    }).initialiseRoutes();
  }

  private generateModels(agmg: ApiGatewayModelGenerator): Map<string, Model> {
    const models: Map<string, Model> = new Map();
    models.set(OfferModel._ModelName, agmg.generateModel(OfferModel).getModel());
    models.set(CompanyInfoModel._ModelName, agmg.generateModel(CompanyInfoModel).getModel());
    models.set(CompanyOffersModel._ModelName, agmg.generateModel(CompanyOffersModel).getModel());
    models.set(OffersHomepageModel._ModelName, agmg.generateModel(OffersHomepageModel).getModel());
    models.set(CompanyMenuModel._ModelName, agmg.generateModel(CompanyMenuModel).getModel());
    models.set(CategoryMenuModel._ModelName, agmg.generateModel(CategoryMenuModel).getModel());
    return models;
  }
}
