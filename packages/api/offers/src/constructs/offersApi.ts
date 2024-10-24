import { Stack } from 'sst/constructs';
import { AuthorizationType, FieldLogLevel, GraphqlApi, SchemaFile } from 'aws-cdk-lib/aws-appsync';
import { IUserPool } from 'aws-cdk-lib/aws-cognito';
import { SecretManager } from './secret-manager';
import { IdentityStackConfigResolver } from "@blc-mono/identity/src/config/config";

/**
 * This class creates the GraphQL API for the Offers API
 * @param stack - The stack to add the API to
 * @param stage - The stage name
 * @param userPool - The Cognito User Pool to use for authentication
 * @param newUserPool - The Cognito New User Pool
 * @param schemaPath - The path to the GraphQL schema
 * @return The GraphQL API
 */
export class OffersApi {
  private readonly _api: GraphqlApi;

  constructor(
    private stack: Stack,
    private userPool: IUserPool,
    private newUserPool: IUserPool,
    private secrets: SecretManager,
    private schemaPath: string,
  ) {
    this._api = this.createApi();
  }

  get api() {
    return this._api;
  }

  private createApi() {
    const identityConfig = IdentityStackConfigResolver.for(this.stack);
    const certificateArn: string = this.secrets.appSyncCertificateArn;
    return new GraphqlApi(this.stack, 'Api', {
      name: `cms-api-${this.stack.stage}`,
      schema: SchemaFile.fromAsset(this.schemaPath),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool: this.userPool,
          },
        },
        additionalAuthorizationModes: [
          {
            authorizationType: AuthorizationType.USER_POOL,
            userPoolConfig: {
              userPool: this.newUserPool,
            },
          },
          {
            authorizationType: AuthorizationType.OIDC,
            openIdConnectConfig: {
              oidcProvider: identityConfig.graphQlConfig.auth0OidcProvider,
            }
          },
        ],
      },
      xrayEnabled: true,
      logConfig: {
        fieldLogLevel: FieldLogLevel.ERROR,
      },
    });
  }
}
