import { ApiGatewayV1Api, Stack } from 'sst/constructs';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { RouteRegistry } from '../routes/routeRegistry';
import { ApiGatewayAuthorizer, SharedAuthorizer } from '../../../core/src/identity/authorizer';
import { IDatabaseAdapter } from './database/IDatabaseAdapter';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { ENVIRONMENTS, OFFERS_DOMAIN_NAME } from '../utils/global-constants';
import { isProduction } from '@blc-mono/core/utils/checkEnvironment';
import { REGIONS } from '@blc-mono/core/types/regions.enum';
import { Tables } from './tables';

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
    const customDomainNameLookUp: Record<string, string> = {
      [REGIONS.EU_WEST_2]: OFFERS_DOMAIN_NAME.UK,
      [REGIONS.AP_SOUTHEAST_2]: OFFERS_DOMAIN_NAME.AUS,
    };

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
          ...([ENVIRONMENTS.STAGING, ENVIRONMENTS.PRODUCTION].includes(this.stack.stage as ENVIRONMENTS) &&
            this.certificateArn && {
              domainName: {
                domainName: isProduction(this.stack.stage)
                  ? customDomainNameLookUp[this.stack.region]
                  : `${this.stack.stage}-${customDomainNameLookUp[this.stack.region]}`,
                certificate: Certificate.fromCertificateArn(this.stack, 'DomainCertificate', this.certificateArn),
              },
            }),
        },
      },
    });
  }
}
