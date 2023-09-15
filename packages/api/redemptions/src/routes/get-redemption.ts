import {
  ApiGatewayModelGenerator,
  MethodResponses,
  Model,
  ResponseModel,
} from '../../../core/src/extensions/apiGatewayExtension';

export class GetRedemptionRoute {
  constructor(private apiGatewayModelGenerator: ApiGatewayModelGenerator, private model: Model) { }

  getRouteDetails() {
    return {
      function: {
        handler: 'packages/api/redemptions/src/route-handlers/get-redemption.handler',
      },
      cdk: {
        method: {
          requestModels: { 'application/json': this.model.getModel() },
          methodResponses: MethodResponses.toMethodResponses([
            new ResponseModel('200', this.model),
            this.apiGatewayModelGenerator.getError404(),
            this.apiGatewayModelGenerator.getError500(),
          ]),
        },
      },
    };
  }
}