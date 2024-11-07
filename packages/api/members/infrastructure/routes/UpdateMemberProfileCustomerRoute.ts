import { ApiGatewayV1ApiRouteProps } from 'sst/constructs';
import {
  ApiGatewayModelGenerator,
  MethodResponses,
  Model,
  ResponseModel,
} from '@blc-mono/core/extensions/apiGatewayExtension';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';

export class UpdateMemberProfileCustomerRoute {
  constructor(
    private apiGatewayModelGenerator: ApiGatewayModelGenerator,
    private agMemberProfileCustomerModel: Model,
    private profileTableName: string,
  ) {}

  getRouteDetails(): ApiGatewayV1ApiRouteProps<never> {
    return {
      function: {
        handler:
          'packages/api/members/application/handlers/profile/updateMemberProfileCustomer.handler',
        environment: {
          SERVICE: 'member',
          PROFILE_TABLE_NAME: this.profileTableName,
        },
        permissions: [
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['dynamodb:Query', 'dynamodb:UpdateItem'],
            resources: [`arn:aws:dynamodb:*:*:table/${this.profileTableName}`],
          }),
        ],
      },
      authorizer: 'none',
      cdk: {
        method: {
          requestModels: { 'application/json': this.agMemberProfileCustomerModel.getModel() },
          methodResponses: MethodResponses.toMethodResponses([
            new ResponseModel('200', this.agMemberProfileCustomerModel),
            this.apiGatewayModelGenerator.getError400(),
            this.apiGatewayModelGenerator.getError404(),
            this.apiGatewayModelGenerator.getError500(),
          ]),
        },
      },
    };
  }
}
