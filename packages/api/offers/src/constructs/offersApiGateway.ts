import { ApiGatewayV1Api, Stack } from 'sst/constructs';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { RouteRegistry } from '../routes/routeRegistry';
import { ApiGatewayAuthorizer, SharedAuthorizer } from '@blc-mono/core/identity/authorizer';
import { IDatabaseAdapter } from './database/IDatabaseAdapter';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { ENVIRONMENTS } from '../utils/global-constants';
import { Tables } from './tables';
import { generateOffersCustomDomainName } from '@blc-mono/core/offers/generateOffersCustomDomainName'
import { GlobalConfigResolver } from '@blc-mono/core/configuration/global-config'

/**
 * Sets up and configures the API Gateway for the offers application, including defining routes and authorizers.
 * This class abstracts the creation of the API and its routes, integrating with Amazon Cognito for authorization.
 */
export class OffersApiGateway {
  private readonly _api: ApiGatewayV1Api;
  private readonly _restApi: RestApi;

  constructor(
    private stack: Stack,
    private authorizer: SharedAuthorizer,
    private readonly dynamoTables: Tables,
    private dbAdapter?: IDatabaseAdapter,
    private readonly certificateArn?: string,
  ) {
    this._api = this.createApi();
    this._restApi = this._api.cdk.restApi;
    new RouteRegistry(this.stack, this.api, this.dynamoTables, this.dbAdapter);
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
    const globalConfig = GlobalConfigResolver.for(this.stack.stage);

    return new ApiGatewayV1Api(this.stack, 'offers', {
      authorizers: {
        offersAuthorizer: ApiGatewayAuthorizer(this.stack, 'ApiGatewayAuthorizer', this.authorizer),
      },
      defaults: {
        authorizer: 'offersAuthorizer',
      },
      cdk: {
        restApi: {
          deployOptions: {
            stageName: 'v1',
          },
          endpointTypes: globalConfig.apiGatewayEndpointTypes,
          ...([ENVIRONMENTS.STAGING, ENVIRONMENTS.PRODUCTION].includes(this.stack.stage as ENVIRONMENTS) &&
            this.certificateArn && {
              domainName: {
                domainName: generateOffersCustomDomainName(this.stack),
                certificate: Certificate.fromCertificateArn(this.stack, 'DomainCertificate', this.certificateArn),
              },
            }),
        },
      },
    });
  }
}
