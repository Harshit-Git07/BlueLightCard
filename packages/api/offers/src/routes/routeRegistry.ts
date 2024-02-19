import { ApiGatewayV1Api, Stack } from 'sst/constructs';
import { OffersRoutes } from './offers/offerRoutes';
import { ApiGatewayModelGenerator } from '../../../core/src/extensions/apiGatewayExtension';
import { OffersModel } from '../models/offers';
import { Model } from 'aws-cdk-lib/aws-apigateway';
import { DatabaseRoute } from './database/databaseRoute';
import { IVpc } from 'aws-cdk-lib/aws-ec2';
import { DatabaseConfig } from '../database/type';

/**
 * The RouteRegistry class provides a centralized way to register all routes for the application.
 */
export class RouteRegistry {
  constructor(stack: Stack, api: ApiGatewayV1Api, vpc: IVpc, dbConfig: DatabaseConfig) {
    this.registerAllRoutes(stack, api, vpc, dbConfig);
  }

  /**
   * Registers all routes for the application.
   *
   * @param {Stack} stack the AWS CDK stack
   * @param {ApiGatewayV1Api} api the API Gateway instance
   */
  private registerAllRoutes(stack: Stack, api: ApiGatewayV1Api, vpc: IVpc, dbConfig: DatabaseConfig) {
    const apiGatewayModelGenerator = new ApiGatewayModelGenerator(api.cdk.restApi);
    const modelMap = this.generateModels(apiGatewayModelGenerator);
    new DatabaseRoute({
      stack,
      api,
      vpc,
      dbConfig,
      apiGatewayModelGenerator,
    }).initialiseRoutes();
    new OffersRoutes({
      stack,
      api,
      apiGatewayModelGenerator,
      model: modelMap.get('OffersModel')!,
    }).initialiseRoutes();
  }

  private generateModels(agmg: ApiGatewayModelGenerator): Map<string, Model> {
    const models: Map<string, Model> = new Map();
    models.set('OffersModel', agmg.generateModel(OffersModel).getModel());

    return models;
  }
}
