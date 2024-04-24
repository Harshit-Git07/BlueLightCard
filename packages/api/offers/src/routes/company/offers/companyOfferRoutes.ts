import { RouteProps } from '../../routeProps';
import { MethodResponses } from '../../../../../core/src/extensions/apiGatewayExtension';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs';
import { Model, RequestValidator } from 'aws-cdk-lib/aws-apigateway';
import { EnvironmentVariablesKeys, getBLCBaseUrlFromEnv } from 'src/utils/environment-variables';
import { OffersFunction } from 'src/constructs/sst/OffersFunction';

export class CompanyOfferRoutes {
  constructor(private readonly routeProps: RouteProps) {}
  initialiseRoutes() {
    this.routeProps.api.addRoutes(this.routeProps.stack, {
      'GET /company/{id}/offers': this.get(),
    });
  }

  private get(): ApiGatewayV1ApiRouteProps<any> {
    return {
      function: new OffersFunction(this.routeProps.stack, 'CompanyOffersHandler', {
        handler: 'packages/api/offers/src/routes/company/offers/getCompanyOffersHandler.handler',
        environment: {
          [EnvironmentVariablesKeys.BASE_URL]: getBLCBaseUrlFromEnv(this.routeProps.stack.stage),
          [EnvironmentVariablesKeys.LEGACY_OFFERS_API_ENDPOINT]: process.env
            .LEGACY_API_RETRIEVE_OFFERS_ENDPOINT as string,
        },
      }),
      cdk: {
        method: {
          requestModels: { 'application/json': this.routeProps.model as Model },
          methodResponses: MethodResponses.toMethodResponses([
            this.routeProps.apiGatewayModelGenerator.getError404(),
            this.routeProps.apiGatewayModelGenerator.getError500(),
          ]),
          requestValidator: new RequestValidator(this.routeProps.stack, 'GetCompanyOffersValidator', {
            restApi: this.routeProps.api.cdk.restApi,
            validateRequestBody: false,
            validateRequestParameters: false,
          }),
        },
      },
    };
  }
}
