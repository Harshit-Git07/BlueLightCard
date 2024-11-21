import { DefaultRouteProps, Route } from '@blc-mono/members/infrastructure/routes/route';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import { MarketingPreferencesModel } from '@blc-mono/members/application/models/marketingPreferences';
import { BrazeAttributesModel } from '@blc-mono/members/application/models/brazeAttributesModel';

export function memberMarketingRoutes(
  defaultRouteProps: DefaultRouteProps,
): Record<string, ApiGatewayV1ApiRouteProps<never>> {
  return {
    'POST /members/marketing/braze/{memberId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberFetchBrazeAttributes',
      handler:
        'packages/api/members/application/handlers/member/marketing/getBrazeAttributes.handler',
      requestModelType: BrazeAttributesModel,
      permissions: ['secretsmanager:GetSecretValue'],
    }),
    'GET /members/marketing/preferences/{memberId}/{environment}': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberGetMarketingPreferences',
      handler:
        'packages/api/members/application/handlers/member/marketing/getMarketingPreferences.handler',
      responseModelType: MarketingPreferencesModel,
      permissions: ['secretsmanager:GetSecretValue'],
    }),
    'PUT /members/marketing/preferences/{memberId}/{environment}': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberUpdateMarketingPreferences',
      handler:
        'packages/api/members/application/handlers/member/marketing/updateMarketingPreferences.handler',
      requestModelType: MarketingPreferencesModel,
      permissions: ['secretsmanager:GetSecretValue'],
    }),
  };
}
