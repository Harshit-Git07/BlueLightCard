import { RequestValidator, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ApiGatewayV1ApiFunctionRouteProps, Stack } from 'sst/constructs';
import { SSTConstruct } from 'sst/constructs/Construct';

import {
  ApiGatewayModelGenerator,
  MethodResponses,
  Model,
  ResponseModel,
} from '@blc-mono/core/extensions/apiGatewayExtension';

import { OrdersStackEnvironmentKeys } from '../constants/environment';
import { SSTFunction } from '../constructs/SSTFunction';

export type RouteOptions = {
  apiGatewayModelGenerator: ApiGatewayModelGenerator;
  environment?: Partial<Record<OrdersStackEnvironmentKeys, string>>;
  handler: string;
  model: Model;
  functionName: string;
  requestValidatorName: string;
  restApi: RestApi;
  stack: Stack;
  bind?: SSTConstruct[];
  defaultAllowedOrigins: string[];
  permissions?: PolicyStatement[];
  authorizer?: 'ordersAuthorizer' | 'none' | string;
  layers: string[] | undefined;
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
    defaultAllowedOrigins,
    permissions,
    authorizer,
    layers,
  }: RouteOptions): ApiGatewayV1ApiFunctionRouteProps<'redemptionsAuthorizer' | 'none' | string> {
    const requestModels = model ? { 'application/json': model.getModel() } : undefined;
    const methodResponses = MethodResponses.toMethodResponses(
      [
        new ResponseModel('200', model),
        apiGatewayModelGenerator.getError404(),
        apiGatewayModelGenerator.getError500(),
      ].filter(Boolean),
    );

    return {
      authorizer: authorizer ? authorizer : 'ordersAuthorizer',
      cdk: {
        function: new SSTFunction(stack, functionName, {
          permissions,
          handler,
          environment: {
            ...environment,
            [OrdersStackEnvironmentKeys.API_DEFAULT_ALLOWED_ORIGINS]: JSON.stringify(defaultAllowedOrigins),
          },
          layers,
        }),
        method: {
          requestModels,
          methodResponses,
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
