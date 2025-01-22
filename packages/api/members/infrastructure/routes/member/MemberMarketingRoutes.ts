import { DefaultRouteProps, Route } from '@blc-mono/members/infrastructure/routes/route';
import { ApiGatewayV1ApiFunctionRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import { MarketingPreferencesModel } from '@blc-mono/shared/models/members/marketingPreferences';
import { BrazeAttributesModel } from '@blc-mono/shared/models/members/brazeAttributesModel';
import { BrazeUpdateModel } from '@blc-mono/shared/models/members/brazeUpdateModel';

export function memberMarketingRoutes(
  defaultRouteProps: DefaultRouteProps,
): Record<string, ApiGatewayV1ApiFunctionRouteProps<'memberAuthorizer'>> {
  return {
    'POST /members/{memberId}/marketing/braze/': Route.createRoute({
      ...defaultRouteProps,

      name: 'MemberFetchBrazeAttributes',
      handler:
        'packages/api/members/application/handlers/member/marketing/getBrazeAttributes.handler',
      requestModelType: BrazeAttributesModel,
      permissions: ['secretsmanager:GetSecretValue'],
    }),

    'GET /members/{memberId}/marketing/preferences/{environment}': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberGetMarketingPreferences',
      handler:
        'packages/api/members/application/handlers/member/marketing/getMarketingPreferences.handler',
      responseModelType: MarketingPreferencesModel,
      permissions: ['secretsmanager:GetSecretValue'],
    }),
    'POST /members/{memberId}/marketing/braze/update': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberUpdateMarketingPreferences',
      handler:
        'packages/api/members/application/handlers/member/marketing/updateMarketingPreferences.handler',
      requestModelType: BrazeUpdateModel,
    }),
  };
}
