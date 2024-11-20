import { Route, RouteOptions } from '@blc-mono/members/infrastructure/routes/route';
import { Stack, Table } from 'sst/constructs';
import { ApiGatewayModelGenerator } from '@blc-mono/core/extensions/apiGatewayExtension';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { MarketingPreferencesModel } from '@blc-mono/members/application/models/marketingPreferences';

export function adminMarketingRoutes(
  stack: Stack,
  restApi: RestApi,
  apiGatewayModelGenerator: ApiGatewayModelGenerator,
): Record<string, ApiGatewayV1ApiRouteProps<never>> {
  const defaultRouteParams = {
    stack,
    restApi,
    defaultAllowedOrigins: ['*'],
    apiGatewayModelGenerator,
  };

  return {
    'POST /admin/members/marketing/brazeAttributes': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminFetchBrazeAttributes',
      handler:
        'packages/api/members/application/handlers/admin/marketing/fetchBrazeAttributes.handler',
    }),
    'GET /admin/members/marketing/preferences/{memberId}': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminGetMarketingPreferences',
      handler:
        'packages/api/members/application/handlers/admin/marketing/getMarketingPreferences.handler',
      responseModel: apiGatewayModelGenerator.generateModel(MarketingPreferencesModel),
    }),
    'PUT /admin/members/marketing/preferences/{memberId}': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminUpdateMarketingPreferences',
      handler:
        'packages/api/members/application/handlers/admin/marketing/updateMarketingPreferences.handler',
      requestModel: apiGatewayModelGenerator.generateModel(MarketingPreferencesModel),
    }),
  };
}
