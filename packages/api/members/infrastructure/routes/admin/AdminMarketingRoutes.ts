import { DefaultRouteProps, Route } from '@blc-mono/members/infrastructure/routes/route';
import { MarketingPreferencesModel } from '@blc-mono/members/application/models/marketingPreferences';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs';

export function adminMarketingRoutes(
  defaultRouteProps: DefaultRouteProps,
): Record<string, ApiGatewayV1ApiRouteProps<never>> {
  return {
    'POST /admin/members/marketing/brazeAttributes': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminFetchBrazeAttributes',
      handler:
        'packages/api/members/application/handlers/admin/marketing/fetchBrazeAttributes.handler',
      permissions: ['secretsmanager:GetSecretValue'],
    }),
    'GET /admin/members/marketing/preferences/{memberId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetMarketingPreferences',
      handler:
        'packages/api/members/application/handlers/admin/marketing/getMarketingPreferences.handler',
      responseModelType: MarketingPreferencesModel,
      permissions: ['secretsmanager:GetSecretValue'],
    }),
    'PUT /admin/members/marketing/preferences/{memberId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminUpdateMarketingPreferences',
      handler:
        'packages/api/members/application/handlers/admin/marketing/updateMarketingPreferences.handler',
      requestModelType: MarketingPreferencesModel,
      permissions: ['secretsmanager:GetSecretValue'],
    }),
  };
}
