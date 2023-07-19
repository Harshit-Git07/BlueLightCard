import {
  ApiGatewayModelGenerator,
  MethodResponses,
  Model,
  ResponseModel,
} from '../../../core/src/extensions/apiGatewayExtension';

export class GetUserByIdRoute {
  constructor(private apiGatewayModelGenerator: ApiGatewayModelGenerator, private agUserModel: Model) {}

  getRouteDetails() {
    return {
      function: {
        handler: 'packages/api/offers/src/offers/lambda.get',
      },
      cdk: {
        method: {
          requestModels: { 'application/json': this.agUserModel.getModel() },
          methodResponses: MethodResponses.toMethodResponses([
            new ResponseModel('200', this.agUserModel),
            this.apiGatewayModelGenerator.getError400(),
            this.apiGatewayModelGenerator.getError404(),
            this.apiGatewayModelGenerator.getError500(),
          ]),
        },
      },
    };
  }
}
