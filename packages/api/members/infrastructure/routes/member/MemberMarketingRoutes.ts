import { DefaultRouteProps, Route } from '@blc-mono/members/infrastructure/routes/route';
import { ApiGatewayV1ApiFunctionRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import { MarketingPreferencesModel } from '@blc-mono/members/application/models/marketingPreferences';
import { BrazeAttributesModel } from '@blc-mono/members/application/models/brazeAttributesModel';
import { BrazeUpdateModel } from '@blc-mono/members/application/models/brazeUpdateModel';

export function memberMarketingRoutes(
  defaultRouteProps: DefaultRouteProps,
): Record<string, ApiGatewayV1ApiFunctionRouteProps<never>> {
  const defaultRouteParams = {
    ...defaultRouteProps,
    environment: {
      BRAZE_SERVICE_JSON: process.env.BRAZE_SERVICE_JSON,
    },
  };

  return {
    'POST /members/{memberId}/marketing/braze/': Route.createRoute({
      ...defaultRouteParams,

      name: 'MemberFetchBrazeAttributes',
      handler:
        'packages/api/members/application/handlers/member/marketing/getBrazeAttributes.handler',
      requestModelType: BrazeAttributesModel,
      permissions: ['secretsmanager:GetSecretValue'],
    }),

    'GET /members/{memberId}/marketing/preferences/{environment}': Route.createRoute({
      ...defaultRouteParams,
      name: 'MemberGetMarketingPreferences',
      handler:
        'packages/api/members/application/handlers/member/marketing/getMarketingPreferences.handler',
      responseModelType: MarketingPreferencesModel,
      permissions: ['secretsmanager:GetSecretValue'],
    }),
    'POST /members/{memberId}/marketing/braze/update': Route.createRoute({
      ...defaultRouteParams,
      name: 'MemberUpdateMarketingPreferences',
      handler:
        'packages/api/members/application/handlers/member/marketing/updateMarketingPreferences.handler',
      requestModelType: BrazeUpdateModel,
    }),
  };
}
