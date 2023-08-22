import { Stack } from 'aws-cdk-lib';
import { AuthorizationType, FieldLogLevel, GraphqlApi, SchemaFile } from 'aws-cdk-lib/aws-appsync';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';

/**
 * This class creates the GraphQL API for the Offers API
 * @param stack - The stack to add the API to
 * @param stage - The stage name
 * @param userPool - The Cognito User Pool to use for authentication
 * @param schemaPath - The path to the GraphQL schema
 * @return The GraphQL API
 */
export class OffersApi {
  static api: GraphqlApi;

  static create(stack: Stack, stage: string, userPool: IUserPool, schemaPath: string) {
    this.api = new GraphqlApi(stack, 'Api', {
      name: `cms-api-${stage}`,
      schema: SchemaFile.fromAsset(schemaPath),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool: userPool,
          },
        },
      },
      xrayEnabled: true,
      logConfig: {
        fieldLogLevel: FieldLogLevel.ERROR,
      },
    });
    return this.api;
  }
}
