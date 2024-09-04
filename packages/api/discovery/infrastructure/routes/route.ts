import { RequestValidator } from 'aws-cdk-lib/aws-apigateway';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { ApiGatewayV1ApiFunctionRouteProps, Function, Stack } from 'sst/constructs';
import { SSTConstruct } from 'sst/constructs/Construct';
import { Permissions } from 'sst/constructs/util/permission';

import {
  ApiGatewayModelGenerator,
  MethodResponses,
  Model,
  ResponseModel,
} from '@blc-mono/core/extensions/apiGatewayExtension';

import { DiscoveryStackEnvironmentKeys } from '../constants/environment';

export type RouteOptions = {
  apiGatewayModelGenerator: ApiGatewayModelGenerator;
  environment?: Partial<Record<DiscoveryStackEnvironmentKeys, string>>;
  handler: string;
  model?: Model;
  functionName: string;
  requestValidatorName: string;
  restApi: RestApi;
  stack: Stack;
  bind?: SSTConstruct[];
  defaultAllowedOrigins: string[];
  permissions?: Permissions;
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
  }: RouteOptions): ApiGatewayV1ApiFunctionRouteProps<'discoveryAuthorizer'> {
    const requestModels = model ? { 'application/json': model.getModel() } : undefined;
    const methodResponses = MethodResponses.toMethodResponses(
      [
        model ? new ResponseModel('200', model) : undefined,
        apiGatewayModelGenerator.getError404(),
        apiGatewayModelGenerator.getError500(),
      ].filter(Boolean),
    );

    return {
      cdk: {
        function: new Function(stack, functionName, {
          permissions,
          handler,
          environment: {
            ...environment,
            [DiscoveryStackEnvironmentKeys.API_DEFAULT_ALLOWED_ORIGINS]: JSON.stringify(defaultAllowedOrigins),
          },
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
