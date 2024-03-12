import { RequestValidator } from 'aws-cdk-lib/aws-apigateway';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ApiGatewayV1ApiFunctionRouteProps, Stack } from 'sst/constructs';
import { SSTConstruct } from 'sst/constructs/Construct';

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
  bind?: SSTConstruct[];
  defaultAllowedOrigins: string[];
  permissions?: PolicyStatement[];
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
    permissions,
  }: RouteOptions): ApiGatewayV1ApiFunctionRouteProps<'redemptionsAuthorizer'> {
    return {
      cdk: {
        function: new SSTFunction(stack, functionName, {
          permissions,
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
