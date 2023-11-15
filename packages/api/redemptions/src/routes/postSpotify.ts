import { IRestApi, MethodResponse, RequestValidator } from 'aws-cdk-lib/aws-apigateway';
import {
  ApiGatewayModelGenerator,
  MethodResponses,
  Model,
  ResponseModel,
} from '../../../core/src/extensions/apiGatewayExtension';
import { Stack } from 'sst/constructs';

interface PostSpotifyHandler {
  function: {
    handler: string;
    environment: {
      CODES_REDEEMED_HOST?: string;
      ENVIRONMENT?: string;
      CODE_REDEEMED_PATH?: string;
      CODE_ASSIGNED_REDEEMED_PATH?: string;
    };
  };
  cdk: {
    method: {
      requestModels: Record<string, any>;
      methodResponses: MethodResponse[];
      requestValidator: RequestValidator;
    };
  };
}

export class PostSpotify {
  constructor(
    private readonly apiGatewayModelGenerator: ApiGatewayModelGenerator,
    private readonly model: Model,
    private readonly stack: Stack,
    private readonly api: IRestApi,
  ) {}

  postSpotify(): PostSpotifyHandler {
    return {
      function: {
        handler: 'packages/api/redemptions/src/handlers/proxy/postSpotify.handler',
        environment: {
          CODES_REDEEMED_HOST: process.env.CODES_REDEEMED_HOST,
          ENVIRONMENT: process.env.ENVIRONMENT,
          CODE_REDEEMED_PATH: process.env.CODE_REDEEMED_PATH,
          CODE_ASSIGNED_REDEEMED_PATH: process.env.CODE_ASSIGNED_REDEEMED_PATH,
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
