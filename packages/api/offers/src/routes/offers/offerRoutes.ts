import { RouteProps } from '../routeProps';
import { MethodResponses, Model } from '../../../../core/src/extensions/apiGatewayExtension';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs';
import { RequestValidator } from 'aws-cdk-lib/aws-apigateway';

export class OffersRoutes {
  constructor(private readonly routeProps: RouteProps) {}

  initialiseRoutes() {
    this.routeProps.api.addRoutes(this.routeProps.stack, {
      'GET /offer': this.get(),
      'POST /offer': this.post(),
    });
  }

  private get(): ApiGatewayV1ApiRouteProps<any> {
    return {
      function: {
        handler: 'packages/api/offers/src/routes/offers/getOfferHandler.handler',
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
        handler: 'packages/api/offers/src/routes/offers/postOfferHandler.handler',
      },
      cdk: {
        method: {
          requestModels: { 'application/json': this.routeProps.model },
          methodResponses: MethodResponses.toMethodResponses([
            this.routeProps.apiGatewayModelGenerator.getError404(),
            this.routeProps.apiGatewayModelGenerator.getError500(),
          ]),
          requestValidator: new RequestValidator(this.routeProps.stack, 'PostOffersValidator', {
            restApi: this.routeProps.api.cdk.restApi,
            validateRequestBody: true,
            validateRequestParameters: true,
          }),
        },
      },
    };
  }
}
