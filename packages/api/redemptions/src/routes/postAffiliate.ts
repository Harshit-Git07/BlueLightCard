import { Stack } from 'aws-cdk-lib';
import { IRestApi, RequestValidator } from 'aws-cdk-lib/aws-apigateway';
import {
  ApiGatewayModelGenerator,
  MethodResponses,
  Model,
  ResponseModel,
} from '../../../core/src/extensions/apiGatewayExtension';

export class PostAffiliate {
  constructor(
    private apiGatewayModelGenerator: ApiGatewayModelGenerator, 
    private model: Model, 
    private stack: Stack, 
    private api: IRestApi
  ) { }

  postAffiliate() {
    return {
      function: {
        handler: 'packages/api/redemptions/src/handlers/affiliate/postAffiliate.handler',
      },
      cdk: {
        method: {
          requestModels: { 'application/json': this.model.getModel() },
          methodResponses: MethodResponses.toMethodResponses([
            new ResponseModel('200', this.model),
            this.apiGatewayModelGenerator.getError404(),
            this.apiGatewayModelGenerator.getError500(),
          ]),
          requestValidator: new RequestValidator(this.stack, "PostAffiliateValidator", {
            restApi: this.api,
            validateRequestBody: true,
            validateRequestParameters: true
          }),
        },
      },
    };
  }
}