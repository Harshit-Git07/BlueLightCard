import { ApiGatewayV1Api, Stack } from 'sst/constructs';
import { Duration } from 'aws-cdk-lib';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { RouteRegistry } from '../routes/routeRegistry';

/**
 * Sets up and configures the API Gateway for the offers application, including defining routes and authorizers.
 * This class abstracts the creation of the API and its routes, integrating with Amazon Cognito for authorization.
 */
export class OffersApiGateway {
  private readonly _api: ApiGatewayV1Api;
  private readonly _restApi: RestApi;

  constructor(private stack: Stack, private cognitoUserPoolId: string) {
    this._api = this.createApi();
    this._restApi = this._api.cdk.restApi;
    new RouteRegistry(this.stack, this.api);
  }

  /**
   * Provides access to the ApiGatewayV1Api instance used for configuring the API.
   *
   * @return {ApiGatewayV1Api} the AWS CDK ApiGatewayV1Api instance
   */
  get api(): ApiGatewayV1Api {
    return this._api;
  }

  /**
   * Provides access to the underlying AWS CDK RestApi instance for lower-level configurations.
   *
   * @return {RestApi} the AWS CDK RestApi instance
   */
  get restApi(): RestApi {
    return this._restApi;
  }

  /**
   * Creates and configures the API Gateway instance, including setting up Cognito authorizers
   * for handling authentication and authorization.
   */
  private createApi(): ApiGatewayV1Api<any> {
    return new ApiGatewayV1Api(this.stack, 'offers', {
      authorizers: {
        OffersAuthorizer: {
          type: 'user_pools',
          userPoolIds: [this.cognitoUserPoolId],
        },
      },
      defaults: {
        authorizer: 'OffersAuthorizer',
        function: {
          timeout: Duration.seconds(5).toSeconds(),
          memorySize: 256,
          environment: { service: 'offers' },
        },
      },
      cdk: {
        restApi: {
          deployOptions: {
            stageName: 'v1',
          },
        },
      },
    });
  }
}
