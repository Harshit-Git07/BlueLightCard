import { Stack } from 'aws-cdk-lib';
import { IRestApi, MethodResponse, RequestValidator } from "aws-cdk-lib/aws-apigateway";
import {
  ApiGatewayModelGenerator,
  MethodResponses,
  Model,
  ResponseModel,
} from '../../../core/src/extensions/apiGatewayExtension';


interface PostAffiliateHandler {
  function: {
    handler: string;
  };
  cdk: {
    method: {
      requestModels: Record<string, any>;
      methodResponses: MethodResponse[];
      requestValidator: RequestValidator;
    };
  };
}

export class PostAffiliate {
  constructor(
    private readonly apiGatewayModelGenerator: ApiGatewayModelGenerator,
    private readonly model: Model,
    private readonly stack: Stack,
    private readonly api: IRestApi,
  ) {}

  postAffiliate(): PostAffiliateHandler {
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
          requestValidator: new RequestValidator(this.stack, 'PostAffiliateValidator', {
            restApi: this.api,
            validateRequestBody: true,
            validateRequestParameters: true,
          }),
        },
      },
    };
  }
}
