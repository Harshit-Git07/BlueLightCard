import { RequestValidator } from 'aws-cdk-lib/aws-apigateway';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { ApiGatewayV1ApiRouteProps, Stack } from 'sst/constructs';

import {
  ApiGatewayModelGenerator,
  MethodResponses,
  Model,
  ResponseModel,
} from '@blc-mono/core/extensions/apiGatewayExtension';

interface RouteParams {
  apiGatewayModelGenerator: ApiGatewayModelGenerator;
  model: Model;
  restApi: RestApi;
}

interface RouteParamsWithHandlerAndStack extends RouteParams {
  stack: Stack;
  handler: string;
  requestValidatorName: string;
}

export class Route {
  public getRoute({
    model,
    apiGatewayModelGenerator,
    restApi,
    stack,
    handler,
    requestValidatorName,
  }: RouteParamsWithHandlerAndStack): ApiGatewayV1ApiRouteProps<'Authorizer'> {
    return {
      function: {
        handler,
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
