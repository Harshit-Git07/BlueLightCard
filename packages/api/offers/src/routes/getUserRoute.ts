import { ApiGatewayModelGenerator } from '../../../core/src/extensions/apiGatewayExtension/agModelGenerator';
import { Model } from '../../../core/src/extensions/apiGatewayExtension/model';
import { MethodResponses } from '../../../core/src/extensions/apiGatewayExtension/methodResponse';
import { ResponseModel } from '../../../core/src/extensions/apiGatewayExtension/responseModel';



export class GerUserRoute {
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
