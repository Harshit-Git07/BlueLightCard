import { IRestApi, RequestValidator } from 'aws-cdk-lib/aws-apigateway';
import { ApiGatewayV1ApiRouteProps, Stack } from 'sst/constructs';

import {
  ApiGatewayModelGenerator,
  MethodResponses,
  Model,
  ResponseModel,
} from '../../../core/src/extensions/apiGatewayExtension';

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export class PostSpotify {
  constructor(
    private readonly apiGatewayModelGenerator: ApiGatewayModelGenerator,
    private readonly model: Model,
    private readonly stack: Stack,
    private readonly api: IRestApi,
  ) {}

  postSpotify(): ApiGatewayV1ApiRouteProps<'Authorizer'> {
    return {
      function: {
        handler: 'packages/api/redemptions/src/handlers/proxy/postSpotify.handler',
        environment: {
          CODES_REDEEMED_HOST: getRequiredEnv('CODES_REDEEMED_HOST'),
          ENVIRONMENT: getRequiredEnv('ENVIRONMENT'),
          CODE_REDEEMED_PATH: getRequiredEnv('CODE_REDEEMED_PATH'),
          CODE_ASSIGNED_REDEEMED_PATH: getRequiredEnv('CODE_ASSIGNED_REDEEMED_PATH'),
        },
      },
      cdk: {
        method: {
          requestModels: { 'application/json': this.model.getModel() },
          methodResponses: MethodResponses.toMethodResponses([
            new ResponseModel('200', this.model),
            this.apiGatewayModelGenerator.getError404(),
            this.apiGatewayModelGenerator.getError500(),
          ]),
          requestValidator: new RequestValidator(this.stack, 'PostSpotifyValidator', {
            restApi: this.api,
            validateRequestBody: true,
            validateRequestParameters: true,
          }),
        },
      },
    };
  }
}
