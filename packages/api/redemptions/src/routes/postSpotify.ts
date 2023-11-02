
import { IRestApi, RequestValidator } from 'aws-cdk-lib/aws-apigateway';
import {
  ApiGatewayModelGenerator,
  MethodResponses,
  Model,
  ResponseModel,
} from '../../../core/src/extensions/apiGatewayExtension';
import { Stack } from "sst/constructs";


export class PostSpotify {
  constructor(
    private apiGatewayModelGenerator: ApiGatewayModelGenerator,
    private model: Model,
    private stack: Stack,
    private api: IRestApi,
  ) {}

  postSpotify() {
    return {
      function: {
        handler: 'packages/api/redemptions/src/handlers/proxy/postSpotify.handler',
        environment: {
          CODES_REDEEMED_HOST: process.env.CODES_REDEEMED_HOST,
          ENVIRONMENT: process.env.ENVIRONMENT,
          CODE_REDEEMED_PATH: process.env.CODE_REDEEMED_PATH,
          CODE_ASSIGNED_REDEEMED_PATH: process.env.CODE_ASSIGNED_REDEEMED_PATH,
        }
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
