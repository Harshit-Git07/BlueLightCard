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

import { PaymentsStackEnvironmentKeys } from '../constants/environment';
import { SSTFunction } from '../constructs/SSTFunction';

export type RouteOptions = {
  apiGatewayModelGenerator: ApiGatewayModelGenerator;
  environment?: Partial<Record<PaymentsStackEnvironmentKeys, string>>;
  handler: string;
  model: Model;
  functionName: string;
  requestValidatorName: string;
  restApi: RestApi;
  stack: Stack;
  bind?: SSTConstruct[];
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
    permissions,
  }: RouteOptions): ApiGatewayV1ApiFunctionRouteProps<'none' | 'iam'> {
    const requestModels = model ? { 'application/json': model.getModel() } : undefined;

    const methodResponses = MethodResponses.toMethodResponses(
      [
        new ResponseModel('200', model),
        apiGatewayModelGenerator.getError404(),
        apiGatewayModelGenerator.getError500(),
      ].filter(Boolean),
    );

    const USE_DATADOG_AGENT = getEnvOrDefault(PaymentsStackEnvironmentKeys.USE_DATADOG_AGENT, 'false');
    // https://docs.datadoghq.com/serverless/aws_lambda/installation/nodejs/?tab=custom
    const layers =
      USE_DATADOG_AGENT.toLowerCase() === 'true' && stack.region
        ? [`arn:aws:lambda:${stack.region}:464622532012:layer:Datadog-Extension:60`]
        : undefined;

    return {
      authorizer: 'iam',
      cdk: {
        function: new SSTFunction(stack, functionName, {
          permissions,
          handler,
          environment: environment,
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
