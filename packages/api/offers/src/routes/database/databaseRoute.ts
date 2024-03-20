import { MethodResponses } from '../../../../core/src/extensions/apiGatewayExtension';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs';
import { OffersFunction } from '../../constructs/sst/OffersFunction';
import { RouteProps } from '../routeProps';

export class DatabaseRoute {
  constructor(private readonly props: RouteProps) {}

  initialiseRoutes() {
    this.props.api.addRoutes(this.props.stack, {
      'GET /db': this.get(),
    });
  }

  private get(): ApiGatewayV1ApiRouteProps<any> {
    return {
      cdk: {
        function: new OffersFunction(this.props.stack, 'DatabaseHandler', {
          handler: 'packages/api/offers/src/routes/database/databaseHandler.handler',
          database: this.props.dbAdapter,
        }),
        method: {
          methodResponses: MethodResponses.toMethodResponses([
            this.props.apiGatewayModelGenerator.getError404(),
            this.props.apiGatewayModelGenerator.getError500(),
          ]),
        },
      },
    };
  }
}
