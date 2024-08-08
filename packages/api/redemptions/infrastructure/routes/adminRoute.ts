import { RequestValidator } from 'aws-cdk-lib/aws-apigateway';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { ApiGatewayV1ApiFunctionRouteProps, Stack } from 'sst/constructs';

import { ApiGatewayModelGenerator, MethodResponses } from '@blc-mono/core/extensions/apiGatewayExtension';
import { getEnv } from '@blc-mono/core/utils/getEnv';

import { RedemptionsStackEnvironmentKeys } from '../constants/environment';
import { SSTFunction } from '../constructs/SSTFunction';
import { IDatabase } from '../database/adapter';

export type RouteOptions = {
  apiGatewayModelGenerator: ApiGatewayModelGenerator;
  environment?: Partial<Record<RedemptionsStackEnvironmentKeys, string>>;
  handler: string;
  functionName: string;
  database?: IDatabase;
  requestValidatorName: string;
  restApi: RestApi;
  stack: Stack;
  permissions?: PolicyStatement[];
};

export class AdminRoute {
  public static createRoute({
    apiGatewayModelGenerator,
    environment,
    handler,
    functionName,
    requestValidatorName,
    restApi,
    stack,
    database,
    permissions,
  }: RouteOptions): ApiGatewayV1ApiFunctionRouteProps<'none' | string> {
    const methodResponses = MethodResponses.toMethodResponses(
      [undefined, apiGatewayModelGenerator.getError404(), apiGatewayModelGenerator.getError500()].filter(Boolean),
    );

    let layers: [string] | undefined;
    try {
      const USE_DATADOG_AGENT = getEnv(RedemptionsStackEnvironmentKeys.USE_DATADOG_AGENT);
      // https://docs.datadoghq.com/serverless/aws_lambda/installation/nodejs/?tab=custom
      const layers =
        USE_DATADOG_AGENT.toLowerCase() === 'true' && stack.region
          ? [`arn:aws:lambda:${stack.region}:464622532012:layer:Datadog-Extension:60`]
          : undefined;
    } catch (err) {
      layers = undefined;
    }

    return {
      cdk: {
        function: new SSTFunction(stack, functionName, {
          permissions,
          handler,
          environment: {
            ...environment,
          },
          database,
          layers,
        }),
        method: {
          apiKeyRequired: true,
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
