import { RequestValidator } from 'aws-cdk-lib/aws-apigateway';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ApiGatewayV1ApiFunctionRouteProps, Function, Stack } from 'sst/constructs';
import { SSTConstruct } from 'sst/constructs/Construct';

import {
  ApiGatewayModelGenerator,
  MethodResponses,
  Model,
  ResponseModel,
} from '@blc-mono/core/extensions/apiGatewayExtension';

import { MemberStackEnvironmentKeys } from '../constants/environment';

export type RouteOptions = {
  apiGatewayModelGenerator: ApiGatewayModelGenerator;
  environment?: Partial<Record<MemberStackEnvironmentKeys, string>>;
  handler: string;
  model?: Model;
  functionName: string;
  requestValidatorName: string;
  restApi: RestApi;
  stack: Stack;
  bind?: SSTConstruct[];
  defaultAllowedOrigins: string[];
  permissions?: PolicyStatement[];
  authorizer?: 'memberAuthorizer' | 'none' | string;
  apiKeyRequired?: boolean;
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
    bind,
    defaultAllowedOrigins,
    permissions,
    authorizer,
    apiKeyRequired,
  }: RouteOptions): ApiGatewayV1ApiFunctionRouteProps<'memberAuthorizer' | 'none' | string> {
    const requestModels = model ? { 'application/json': model.getModel() } : undefined;
    const methodResponses = model
      ? MethodResponses.toMethodResponses(
          [
            new ResponseModel('200', model),
            apiGatewayModelGenerator.getError404(),
            apiGatewayModelGenerator.getError500(),
          ].filter(Boolean),
        )
      : undefined;

    return {
      authorizer: authorizer ? authorizer : 'memberAuthorizer',
      cdk: {
        function: new Function(stack, functionName, {
          bind: bind,
          permissions,
          handler,
          environment: {
            ...environment,
            [MemberStackEnvironmentKeys.API_DEFAULT_ALLOWED_ORIGINS]:
              JSON.stringify(defaultAllowedOrigins),
          },
        }),
        method: {
          apiKeyRequired: apiKeyRequired,
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
