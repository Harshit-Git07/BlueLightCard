import { RequestValidator } from 'aws-cdk-lib/aws-apigateway';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { ApiGatewayV1ApiRouteProps, Stack } from 'sst/constructs';

import {
  ApiGatewayModelGenerator,
  MethodResponses,
  Model,
  ResponseModel,
} from '@blc-mono/core/extensions/apiGatewayExtension';

import { EnvironmentKeys } from '../constants/environment';

export type RouteOptions = {
  apiGatewayModelGenerator: ApiGatewayModelGenerator;
  environment?: Partial<Record<EnvironmentKeys, string>>;
  handler: string;
  model: Model;
  requestValidatorName: string;
  restApi: RestApi;
  stack: Stack;
};

export class Route {
  public static createRoute({
    apiGatewayModelGenerator,
    environment,
    handler,
    model,
    requestValidatorName,
    restApi,
    stack,
  }: RouteOptions): ApiGatewayV1ApiRouteProps<'Authorizer'> {
    return {
      function: {
        handler,
        environment,
      },
      cdk: {
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
