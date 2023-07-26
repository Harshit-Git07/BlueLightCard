import {
  ApiGatewayModelGenerator,
  MethodResponses,
  Model,
  ResponseModel,
} from '../../../core/src/extensions/apiGatewayExtension';

export class PostUserRoute {
  constructor(private apiGatewayModelGenerator: ApiGatewayModelGenerator, private agUserModel: Model) {}

  getRouteDetails() {
    return {
      function: {
        handler: 'packages/api/identity/src/user-management/lambda.post',
      },
      cdk: {
        method: {
          requestModels: { 'application/json': this.agUserModel.getModel() },
          methodResponses: MethodResponses.toMethodResponses([
            new ResponseModel('201', this.agUserModel),
            this.apiGatewayModelGenerator.getError400(),
            ...this.apiGatewayModelGenerator.getDefault4xxErrors(),
            ...this.apiGatewayModelGenerator.getDefault5xxErrors(),
          ]),
        },
      },
    };
  }
}
