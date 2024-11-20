import { RequestValidator } from 'aws-cdk-lib/aws-apigateway';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import {
  ApiGatewayV1Api,
  ApiGatewayV1ApiFunctionRouteProps,
  Function,
  Stack,
} from 'sst/constructs';
import { SSTConstruct } from 'sst/constructs/Construct';
import { Permissions } from 'sst/constructs/util/permission';

import {
  ApiGatewayModelGenerator,
  MethodResponses,
  Model,
  ResponseModel,
} from '@blc-mono/core/extensions/apiGatewayExtension';

import { MemberStackEnvironmentKeys } from '../constants/environment';

export type RouteOptions = {
  stack: Stack;
  name: string;
  apiGatewayModelGenerator: ApiGatewayModelGenerator;
  environment?: Partial<Record<MemberStackEnvironmentKeys, string>>;
  handler: string;
  restApi: RestApi;
  requestModel?: Model;
  responseModel?: Model;
  bind?: SSTConstruct[];
  defaultAllowedOrigins: string[];
  permissions?: Permissions;
  apiKeyRequired?: boolean;
};

export class Route {
  public static createRoute({
    stack,
    name,
    apiGatewayModelGenerator,
    environment,
    handler,
    restApi,
    requestModel,
    responseModel,
    bind,
    defaultAllowedOrigins,
    permissions,
    apiKeyRequired,
  }: RouteOptions): ApiGatewayV1ApiFunctionRouteProps<never> {
    const requestModels = requestModel
      ? { 'application/json': requestModel.getModel() }
      : undefined;
    const methodResponses = responseModel
      ? MethodResponses.toMethodResponses(
          [
            new ResponseModel('200', responseModel),
            new ResponseModel('201', apiGatewayModelGenerator.generateGenericModel()),
            new ResponseModel('204', apiGatewayModelGenerator.generateGenericModel()),
            apiGatewayModelGenerator.getError400(),
            apiGatewayModelGenerator.getError401(),
            apiGatewayModelGenerator.getError403(),
            apiGatewayModelGenerator.getError404(),
            apiGatewayModelGenerator.getError500(),
          ].filter(Boolean),
        )
      : undefined;

    return {
      cdk: {
        function: new Function(stack, `${name}Function`, {
          bind: bind,
          permissions,
          handler,
          environment: {
            SERVICE: 'member',
            ...environment,
            [MemberStackEnvironmentKeys.API_DEFAULT_ALLOWED_ORIGINS]:
              JSON.stringify(defaultAllowedOrigins),
          },
        }),
        method: {
          apiKeyRequired: apiKeyRequired,
          requestModels,
          methodResponses,
          requestValidator: Route.requestValidator(stack, restApi),
        },
      },
    };
  }

  private static requestValidators: Record<string, RequestValidator> = {};

  private static requestValidator(stack: Stack, restApi: RestApi): RequestValidator {
    let validator = Route.requestValidators[stack.stackName];
    if (!validator) {
      validator = new RequestValidator(stack, `${stack.stackName}-RequestValidator`, {
        restApi,
        validateRequestBody: true,
        validateRequestParameters: true,
      });
    }
    Route.requestValidators[stack.stackName] = validator;

    return validator;
  }
}
