import { ApiGatewayV1ApiRouteProps } from 'sst/constructs';
import {
  ApiGatewayModelGenerator,
  MethodResponses,
  Model,
  ResponseModel,
} from '@blc-mono/core/extensions/apiGatewayExtension';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';

export class GetMemberProfilesRoute {
  constructor(
    private apiGatewayModelGenerator: ApiGatewayModelGenerator,
    private agMemberProfileModel: Model,
    private identityTableName: string,
  ) {}

  getRouteDetails(): ApiGatewayV1ApiRouteProps<never> {
    return {
      function: {
        handler: 'packages/api/members/application/handlers/profile/getMemberProfiles.handler',
        environment: {
          SERVICE: 'member',
          IDENTITY_TABLE_NAME: this.identityTableName,
        },
        permissions: [
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['dynamodb:Query'],
            resources: [`arn:aws:dynamodb:*:*:table/${this.identityTableName}`],
          }),
        ],
      },
      authorizer: 'none',
      cdk: {
        method: {
          requestModels: { 'application/json': this.agMemberProfileModel.getModel() },
          methodResponses: MethodResponses.toMethodResponses([
            new ResponseModel('200', this.agMemberProfileModel),
            this.apiGatewayModelGenerator.getError400(),
            this.apiGatewayModelGenerator.getError404(),
            this.apiGatewayModelGenerator.getError500(),
          ]),
        },
      },
    };
  }
}
