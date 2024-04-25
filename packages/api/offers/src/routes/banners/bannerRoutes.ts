import { RouteProps } from '../routeProps';
import { MethodResponses } from '../../../../core/src/extensions/apiGatewayExtension';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs';
import { OffersFunction } from 'src/constructs/sst/OffersFunction';
import { EnvironmentVariablesKeys } from 'src/utils/environment-variables';

export class BannerRoutes {
  constructor(private readonly routeProps: RouteProps) {}
  initialiseRoutes() {
    this.routeProps.api.addRoutes(this.routeProps.stack, {
      'GET /banners': this.get(),
    });
  }

  private get(): ApiGatewayV1ApiRouteProps<any> {
    return {
      cdk: {
        function: new OffersFunction(this.routeProps.stack, 'BannersHandler', {
          handler: 'packages/api/offers/src/routes/banners/getBannersHandler.handler',
          environment: {
            [EnvironmentVariablesKeys.BANNERS_TABLE_NAME]: this.routeProps.dynamoTables!.bannersTable.tableName,
          },
          permissions: ['dynamodb:Query'],
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
