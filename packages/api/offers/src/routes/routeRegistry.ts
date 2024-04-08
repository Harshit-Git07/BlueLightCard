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
import { OffersHomepageRoutes } from './offers/homepage/homepageRoutes';
import { OffersHomepageModel } from 'src/models/offersHomepage';

/**
 * The RouteRegistry class provides a centralized way to register all routes for the application.
 */
export class RouteRegistry {
  constructor(stack: Stack, api: ApiGatewayV1Api, dbAdapter?: IDatabaseAdapter) {
    this.registerAllRoutes(stack, api, dbAdapter);
  }

  /**
   * Registers all routes for the application.
   *
   * @param {Stack} stack the AWS CDK stack
   * @param {ApiGatewayV1Api} api the API Gateway instance
   */
  private registerAllRoutes(stack: Stack, api: ApiGatewayV1Api, dbAdapter?: IDatabaseAdapter) {
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
      model: modelMap.get('OfferModel')!,
    }).initialiseRoutes();
    new CompanyRoutes({
      stack,
      api,
      apiGatewayModelGenerator,
      model: modelMap.get('CompanyInfoModel')!,
    }).initialiseRoutes();
    new CompanyOfferRoutes({
      stack,
      api,
      apiGatewayModelGenerator,
      model: modelMap.get('CompanyOffersModel')!,
    }).initialiseRoutes();
    new OffersHomepageRoutes({
      stack,
      api,
      apiGatewayModelGenerator,
      model: modelMap.get('OffersHomepageModel')!,
    }).initialiseRoutes();
  }

  private generateModels(agmg: ApiGatewayModelGenerator): Map<string, Model> {
    const models: Map<string, Model> = new Map();
    models.set('OfferModel', agmg.generateModel(OfferModel).getModel());
    models.set('CompanyInfoModel', agmg.generateModel(CompanyInfoModel).getModel());
    models.set('CompanyOffersModel', agmg.generateModel(CompanyOffersModel).getModel());
    models.set('OffersHomepageModel', agmg.generateModel(OffersHomepageModel).getModel());
    return models;
  }
}
