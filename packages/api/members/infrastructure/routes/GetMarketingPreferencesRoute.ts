import { ApiGatewayV1ApiRouteProps } from 'sst/constructs';
import {
  ApiGatewayModelGenerator,
  MethodResponses,
  Model,
  ResponseModel,
} from '@blc-mono/core/extensions/apiGatewayExtension';

export class GetMarketingPreferencesRoute {
  constructor(
    private apiGatewayModelGenerator: ApiGatewayModelGenerator,
    private agMemberApplicationModel: Model,
    private stage: string,
  ) {}

  getRouteDetails(): ApiGatewayV1ApiRouteProps<never> {
    return {
      function: {
        handler: 'packages/api/members/application/handlers/braze/getMarketingPreferences.handler',
        environment: {
          SERVICE: 'member',
          STAGE: this.stage as string,
        },
        permissions: ['secretsmanager:GetSecretValue'],
      },
      authorizer: 'none',
      cdk: {
        method: {
          requestModels: { 'application/json': this.agMemberApplicationModel.getModel() },
          methodResponses: MethodResponses.toMethodResponses([
            new ResponseModel('200', this.agMemberApplicationModel),
            this.apiGatewayModelGenerator.getError400(),
            this.apiGatewayModelGenerator.getError404(),
            this.apiGatewayModelGenerator.getError500(),
          ]),
        },
      },
    };
  }
}
