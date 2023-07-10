import {
  ApiGatewayModelGenerator,
  MethodResponses,
  ResponseModel,
} from '../../../core/src/extensions/apiGatewayExtension';

export class DeleteUserByIdRoute {
  constructor(private apiGatewayModelGenerator: ApiGatewayModelGenerator) {}

  getRouteDetails() {
    return {
      function: {
        handler: 'packages/api/offers/src/offers/lambda.remove',
      },
      cdk: {
        method: {
          methodResponses: MethodResponses.toMethodResponses([
            new ResponseModel('200', this.apiGatewayModelGenerator.generateGenericModel()),
            this.apiGatewayModelGenerator.getError400(),
            this.apiGatewayModelGenerator.getError404(),
            this.apiGatewayModelGenerator.getError500(),
          ]),
        },
      },
    };
  }
}
