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
import { getEnvOrDefault } from '@blc-mono/core/utils/getEnv';

import { RedemptionsStackEnvironmentKeys } from '../constants/environment';
import { SSTFunction } from '../constructs/SSTFunction';
import { IDatabase } from '../database/adapter';

export type RouteOptions = {
  apiGatewayModelGenerator: ApiGatewayModelGenerator;
  environment?: Partial<Record<RedemptionsStackEnvironmentKeys, string>>;
  handler: string;
  model?: Model;
  functionName: string;
  database?: IDatabase;
  requestValidatorName: string;
  restApi: RestApi;
  stack: Stack;
  bind?: SSTConstruct[];
  defaultAllowedOrigins: string[];
  permissions?: PolicyStatement[];
  authorizer?: 'redemptionsAuthorizer' | 'none' | string;
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
    authorizer,
  }: RouteOptions): ApiGatewayV1ApiFunctionRouteProps<'redemptionsAuthorizer' | 'none' | string> {
    const requestModels = model ? { 'application/json': model.getModel() } : undefined;
    const methodResponses = MethodResponses.toMethodResponses(
      [
        model ? new ResponseModel('200', model) : undefined,
        apiGatewayModelGenerator.getError404(),
        apiGatewayModelGenerator.getError500(),
      ].filter(Boolean),
    );

    const USE_DATADOG_AGENT = getEnvOrDefault(RedemptionsStackEnvironmentKeys.USE_DATADOG_AGENT, 'false');
    // https://docs.datadoghq.com/serverless/aws_lambda/installation/nodejs/?tab=custom
    const layers =
      USE_DATADOG_AGENT === 'true' ? ['arn:aws:lambda:eu-west-2:464622532012:layer:Datadog-Extension:60'] : undefined;

    return {
      authorizer: authorizer ? authorizer : 'redemptionsAuthorizer',
      cdk: {
        function: new SSTFunction(stack, functionName, {
          permissions,
          handler,
          environment: {
            ...environment,
            [RedemptionsStackEnvironmentKeys.API_DEFAULT_ALLOWED_ORIGINS]: JSON.stringify(defaultAllowedOrigins),
          },
          database,
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
