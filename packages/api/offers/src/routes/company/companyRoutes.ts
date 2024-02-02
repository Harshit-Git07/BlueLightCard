import { RouteProps } from '../routeProps';
import { MethodResponses, Model } from '@blc-mono/core/extensions/apiGatewayExtension';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs';

export class CompanyRoutes {
  constructor(private readonly routeProps: RouteProps) {}

  initialiseRoutes() {
    this.routeProps.api.addRoutes(this.routeProps.stack, {
      'GET /company': this.get(),
      'POST /company': this.post(),
    });
  }

  get(): ApiGatewayV1ApiRouteProps<any> {
    return {
      function: {
        handler: 'packages/api/offers/src/routes/company/getCompanyHandler.handler',
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

  post(): ApiGatewayV1ApiRouteProps<any> {
    return {
      function: {
        handler: 'packages/api/offers/src/routes/company/postCompanyHandler.handler',
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
}
