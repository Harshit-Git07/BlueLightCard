import { ApiGatewayV1Api, Stack } from 'sst/constructs';
import { OffersRoutes } from './offers/offerRoutes';
import { CompanyRoutes } from './company/companyRoutes';
import { ApiGatewayModelGenerator } from '../../../core/src/extensions/apiGatewayExtension';
import { OffersLegacyRoute } from './offers/legacy/offersLegacyRoute';
import { OffersModel } from '../models/offers';
import { CompanyModel } from '../models/company';
import { Model } from 'aws-cdk-lib/aws-apigateway';

/**
 * The RouteRegistry class provides a centralized way to register all routes for the application.
 */
export class RouteRegistry {
  constructor(stack: Stack, api: ApiGatewayV1Api) {
    this.registerAllRoutes(stack, api);
  }

  /**
   * Registers all routes for the application.
   *
   * @param {Stack} stack the AWS CDK stack
   * @param {ApiGatewayV1Api} api the API Gateway instance
   */
  private registerAllRoutes(stack: Stack, api: ApiGatewayV1Api) {
    const apiGatewayModelGenerator = new ApiGatewayModelGenerator(api.cdk.restApi);
    const modelMap: Map<string, Model> = this.generateModels(apiGatewayModelGenerator);
    modelMap.get('OffersModel');
    // Handle all /offer routes
    new OffersRoutes({
      stack,
      api,
      apiGatewayModelGenerator,
      model: modelMap.get('OffersModel')!,
    }).initialiseRoutes();
    // Handle all /offer/legacy routes
    new OffersLegacyRoute({
      stack,
      api,
      apiGatewayModelGenerator,
      model: modelMap.get('OffersModel')!,
    }).initialiseRoutes();
    // Handle all /company routes
    new CompanyRoutes({
      stack,
      api,
      apiGatewayModelGenerator,
      model: modelMap.get('CompanyModel')!,
    }).initialiseRoutes();
  }

  private generateModels(agmg: ApiGatewayModelGenerator) {
    const models: Map<string, Model> = new Map();
    models.set('OffersModel', agmg.generateModel(OffersModel).getModel());
    models.set('CompanyModel', agmg.generateModel(CompanyModel).getModel());
    return models;
  }
}
