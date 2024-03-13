import { RouteProps } from '../routeProps';
import { MethodResponses } from '../../../../core/src/extensions/apiGatewayExtension';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs';
import { OffersFunction } from '../../constructs/sst/OffersFunction';
import { DatabaseAdapter } from '../../constructs/database/adapter';

export class DatabaseRoute {
  constructor(private readonly routeProps: RouteProps) {}

  initialiseRoutes() {
    this.routeProps.api.addRoutes(this.routeProps.stack, {
      'GET /db': this.get(),
    });
  }

  private get(): ApiGatewayV1ApiRouteProps<any> {
    return {
      cdk: {
        function: new OffersFunction(this.routeProps.stack, 'DatabaseHandler', {
          handler: 'packages/api/offers/src/routes/database/databaseHandler.handler',
          database: DatabaseAdapter.get(),
        }),
        method: {
          methodResponses: MethodResponses.toMethodResponses([
            this.routeProps.apiGatewayModelGenerator.getError404(),
            this.routeProps.apiGatewayModelGenerator.getError500(),
          ]),
        },
      },
    };
  }
}
