import { DefaultRouteProps, Route } from '@blc-mono/members/infrastructure/routes/route';
import { MarketingPreferencesModel } from '@blc-mono/members/application/models/marketingPreferences';
import { BrazeUpdateModel } from '@blc-mono/members/application/models/brazeUpdateModel';
import { BrazeAttributesModel } from '@blc-mono/members/application/models/brazeAttributesModel';
import { ApiGatewayV1ApiFunctionRouteProps, ApiGatewayV1ApiRouteProps } from 'sst/constructs';

export function adminMarketingRoutes(
  defaultRouteProps: DefaultRouteProps,
): Record<string, ApiGatewayV1ApiFunctionRouteProps<'memberAuthorizer'>> {
  const defaultRouteParams = {
    ...defaultRouteProps,
    environment: {
      BRAZE_SERVICE_JSON: process.env.BRAZE_SERVICE_JSON,
    },
  };

  return {
    'POST /admin/members/{memberId}/marketing/braze': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminFetchBrazeAttributes',
      handler:
        'packages/api/members/application/handlers/admin/marketing/getBrazeAttributes.handler',
      responseModelType: BrazeAttributesModel,
    }),
    'GET /admin/members/{memberId}/marketing/preferences/{environment}': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminGetMarketingPreferences',
      handler:
        'packages/api/members/application/handlers/admin/marketing/getMarketingPreferences.handler',
      responseModelType: MarketingPreferencesModel,
      permissions: ['secretsmanager:GetSecretValue'],
    }),
    'POST /admin/members/{memberId}/marketing/braze/update': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminUpdateMarketingPreferences',
      handler:
        'packages/api/members/application/handlers/admin/marketing/updateMarketingPreferences.handler',
      responseModelType: BrazeUpdateModel,
    }),
  };
}
