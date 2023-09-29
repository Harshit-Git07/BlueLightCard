import { ApiGatewayV1ApiRouteProps } from 'sst/constructs';
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
        handler: 'packages/api/identity/src/user-management/userData.get',
      },
      authorizer: "identityAuthorizer",
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
    } as unknown as ApiGatewayV1ApiRouteProps<any>;
  }
}
