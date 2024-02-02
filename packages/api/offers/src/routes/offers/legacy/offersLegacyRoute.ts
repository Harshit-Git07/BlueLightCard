import { MethodResponses } from '../../../../../core/src/extensions/apiGatewayExtension';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs';
import { RequestValidator } from 'aws-cdk-lib/aws-apigateway';
import { RouteProps } from '../../routeProps';

// This is sample Route and can be deleted after the first route is added
export class OffersLegacyRoute {
  constructor(private readonly routeProps: RouteProps) {}

  initialiseRoutes() {
    this.routeProps.api.addRoutes(this.routeProps.stack, {
      'GET /offer/legacy': this.get(),
      'POST /offer/legacy': this.post(),
    });
  }

  private get(): ApiGatewayV1ApiRouteProps<any> {
    return {
      function: {
        handler: 'packages/api/offers/src/routes/offers/legacy/getOfferLegacyHandler.handler',
      },
      cdk: {
        method: {
          requestModels: { 'application/json': this.routeProps.model },
          methodResponses: MethodResponses.toMethodResponses([
            this.routeProps.apiGatewayModelGenerator.getError404(),
            this.routeProps.apiGatewayModelGenerator.getError500(),
          ]),
        },
      },
    };
  }

  private post(): ApiGatewayV1ApiRouteProps<any> {
    return {
      function: {
        handler: 'packages/api/offers/src/routes/offers/legacy/postOfferLegacyHandler.handler',
      },
      cdk: {
        method: {
          requestModels: { 'application/json': this.routeProps.model },
          methodResponses: MethodResponses.toMethodResponses([
            this.routeProps.apiGatewayModelGenerator.getError404(),
            this.routeProps.apiGatewayModelGenerator.getError500(),
          ]),
          requestValidator: new RequestValidator(this.routeProps.stack, 'PostOffersLegacyValidator', {
            restApi: this.routeProps.api.cdk.restApi,
            validateRequestBody: true,
            validateRequestParameters: true,
          }),
        },
      },
    };
  }
}
