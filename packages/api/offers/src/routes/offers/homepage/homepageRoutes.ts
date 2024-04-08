import { RouteProps } from '../../routeProps';
import { MethodResponses } from '../../../../../core/src/extensions/apiGatewayExtension';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs';
import { OffersFunction } from 'src/constructs/sst/OffersFunction';
import { isProduction } from '@blc-mono/core/utils/checkEnvironment';

export class OffersHomepageRoutes {
  constructor(private readonly routeProps: RouteProps) {}
  initialiseRoutes() {
    this.routeProps.api.addRoutes(this.routeProps.stack, {
      'GET /offers/homepage': this.getHomepage(),
    });
  }

  private getHomepage(): ApiGatewayV1ApiRouteProps<any> {
    return {
      cdk: {
        function: new OffersFunction(this.routeProps.stack, 'HomepageMenuHandler', {
          handler: 'packages/api/offers/src/routes/offers/homepage/getOffersHomepageHandler.handler',
          environment: {
            OFFER_HOMEPAGE_TABLE_NAME: isProduction(this.routeProps.stack.stage)
              ? 'production-blc-mono-offersHomepage'
              : 'staging-blc-mono-offersHomepage',
          },
          permissions: ['dynamodb:BatchGetItem'],
        }),
        method: {
          requestModels: { 'application/json': this.routeProps.model! },
          methodResponses: MethodResponses.toMethodResponses([
            this.routeProps.apiGatewayModelGenerator.getError404(),
            this.routeProps.apiGatewayModelGenerator.getError500(),
          ]),
        },
      },
    };
  }
}
