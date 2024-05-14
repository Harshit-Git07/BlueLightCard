import { RouteProps } from '../routeProps';
import { MethodResponses } from '../../../../core/src/extensions/apiGatewayExtension';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs';
import { Model, RequestValidator } from 'aws-cdk-lib/aws-apigateway';
import { EnvironmentVariablesKeys, getBLCBaseUrlFromEnv } from 'src/utils/environment-variables';
import { isProduction } from '@blc-mono/core/utils/checkEnvironment';
import { OffersFunction } from 'src/constructs/sst/OffersFunction';
import { th } from '@faker-js/faker';

export class OffersRoutes {
  constructor(private readonly routeProps: RouteProps) {}
  initialiseRoutes() {
    this.routeProps.api.addRoutes(this.routeProps.stack, {
      'GET /offers/{id}': this.get(),
    });
  }

  private get(): ApiGatewayV1ApiRouteProps<any> {
    return {
      function: new OffersFunction(this.routeProps.stack, 'GetOfferHandler', {
        handler: 'packages/api/offers/src/routes/offers/getOfferHandler.handler',
        environment: {
          [EnvironmentVariablesKeys.BASE_URL]: getBLCBaseUrlFromEnv(this.routeProps.stack.stage),
          [EnvironmentVariablesKeys.LEGACY_OFFERS_API_ENDPOINT]: process.env
            .LEGACY_API_RETRIEVE_OFFERS_ENDPOINT as string,
          [EnvironmentVariablesKeys.STAGE]: this.routeProps.stack.stage,
        },
        permissions: [],
      }),
      cdk: {
        method: {
          requestModels: { 'application/json': this.routeProps.model as Model },
          methodResponses: MethodResponses.toMethodResponses([
            this.routeProps.apiGatewayModelGenerator.getError404(),
            this.routeProps.apiGatewayModelGenerator.getError500(),
          ]),
          requestValidator: new RequestValidator(this.routeProps.stack, 'GetOffersValidator', {
            restApi: this.routeProps.api.cdk.restApi,
            validateRequestBody: false,
            validateRequestParameters: false,
          }),
        },
      },
    };
  }
}
