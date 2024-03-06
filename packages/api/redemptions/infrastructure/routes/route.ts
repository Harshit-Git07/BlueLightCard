import { RequestValidator } from 'aws-cdk-lib/aws-apigateway';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { ApiGatewayV1ApiFunctionRouteProps, Stack } from 'sst/constructs';

import {
  ApiGatewayModelGenerator,
  MethodResponses,
  Model,
  ResponseModel,
} from '@blc-mono/core/extensions/apiGatewayExtension';

import { RedemptionsStackEnvironmentKeys } from '../constants/environment';
import { SSTFunction } from '../constructs/SSTFunction';
import { IDatabase } from '../database/adapter';

export type RouteOptions = {
  apiGatewayModelGenerator: ApiGatewayModelGenerator;
  environment?: Partial<Record<RedemptionsStackEnvironmentKeys, string>>;
  handler: string;
  model: Model;
  functionName: string;
  database?: IDatabase;
  requestValidatorName: string;
  restApi: RestApi;
  stack: Stack;
  defaultAllowedOrigins: string[];
};

export class Route {
  public static createRoute({
    apiGatewayModelGenerator,
    environment,
    handler,
    model,
    functionName,
    requestValidatorName,
    restApi,
    stack,
    database,
    defaultAllowedOrigins,
  }: RouteOptions): ApiGatewayV1ApiFunctionRouteProps<'redemptionsAuthorizer'> {
    return {
      cdk: {
        function: new SSTFunction(stack, functionName, {
          handler,
          environment: {
            ...environment,
            [RedemptionsStackEnvironmentKeys.API_DEFAULT_ALLOWED_ORIGINS]: JSON.stringify(defaultAllowedOrigins),
          },
          database,
        }),
        method: {
          requestModels: { 'application/json': model.getModel() },
          methodResponses: MethodResponses.toMethodResponses([
            new ResponseModel('200', model),
            apiGatewayModelGenerator.getError404(),
            apiGatewayModelGenerator.getError500(),
          ]),
          requestValidator: new RequestValidator(stack, requestValidatorName, {
            restApi,
            validateRequestBody: true,
            validateRequestParameters: true,
          }),
        },
      },
    };
  }
}
