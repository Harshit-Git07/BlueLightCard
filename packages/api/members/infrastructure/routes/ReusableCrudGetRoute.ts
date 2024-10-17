import { ApiGatewayV1ApiRouteProps } from 'sst/constructs';
import {
  ApiGatewayModelGenerator,
  MethodResponses,
  Model,
  ResponseModel,
} from '@blc-mono/core/extensions/apiGatewayExtension';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';

export class ReusableCrudGetRoute {
  constructor(
    private apiGatewayModelGenerator: ApiGatewayModelGenerator,
    private agCrudGetModel: Model,
    private entityTableName: string,
    private entityName: string,
    private entityCollectionName: string,
    private pkPrefix: string,
    private skPrefix: string,
    private pkQueryKey: string,
    private skQueryKey: string,
    private modelName: string,
    private payloadTypeName: string,
  ) {}

  getRouteDetails(): ApiGatewayV1ApiRouteProps<never> {
    return {
      function: {
        handler: 'packages/api/members/application/handlers/reusableCrudGetHandler.handler',
        environment: {
          SERVICE: 'member',
          ENTITY_NAME: this.entityName,
          ENTITY_TABLE_NAME: this.entityTableName,
          ENTITY_COLLECTION_NAME: this.entityCollectionName,
          PK_PREFIX: this.pkPrefix,
          SK_PREFIX: this.skPrefix,
          PK_QUERY_KEY: this.pkQueryKey,
          SK_QUERY_KEY: this.skQueryKey,
          MODEL_NAME: this.modelName,
          PAYLOAD_TYPE_NAME: this.payloadTypeName,
        },
        permissions: [
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['dynamodb:Query'],
            resources: [`arn:aws:dynamodb:*:*:table/${this.entityTableName}`],
          }),
        ],
      },
      authorizer: 'none',
      cdk: {
        method: {
          requestModels: { 'application/json': this.agCrudGetModel.getModel() },
          methodResponses: MethodResponses.toMethodResponses([
            new ResponseModel('200', this.agCrudGetModel),
            this.apiGatewayModelGenerator.getError400(),
            this.apiGatewayModelGenerator.getError404(),
            this.apiGatewayModelGenerator.getError500(),
          ]),
        },
      },
    };
  }
}
