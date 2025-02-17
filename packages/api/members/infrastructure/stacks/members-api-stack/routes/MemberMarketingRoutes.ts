import { MarketingPreferencesModel } from '@blc-mono/shared/models/members/marketingPreferences';
import { BrazeAttributesModel } from '@blc-mono/shared/models/members/brazeAttributesModel';
import { BrazeUpdateModel } from '@blc-mono/shared/models/members/brazeUpdateModel';
import { MemberRoutes } from '@blc-mono/members/infrastructure/stacks/members-api-stack/routes/types/memberRoutes';
import {
  createRoute,
  DefaultRouteProps,
} from '@blc-mono/members/infrastructure/stacks/shared/rest-api/builders/route';

export function memberMarketingRoutes(defaultRouteProps: DefaultRouteProps): MemberRoutes {
  return {
    'GET /members/{memberId}/marketing/preferences/{environment}': createRoute({
      ...defaultRouteProps,
      name: 'MemberGetMarketingPreferences',
      handler:
        'packages/api/members/application/handlers/member/marketing/getMarketingPreferences.handler',
      responseModelType: MarketingPreferencesModel,
      permissions: ['secretsmanager:GetSecretValue'],
    }),
    'POST /members/{memberId}/marketing/braze/': createRoute({
      ...defaultRouteProps,
      name: 'MemberFetchBrazeAttributes',
      handler:
        'packages/api/members/application/handlers/member/marketing/getBrazeAttributes.handler',
      requestModelType: BrazeAttributesModel,
      permissions: ['secretsmanager:GetSecretValue'],
    }),
    'POST /members/{memberId}/marketing/braze/update': createRoute({
      ...defaultRouteProps,
      name: 'MemberUpdateMarketingPreferences',
      handler:
        'packages/api/members/application/handlers/member/marketing/updateMarketingPreferences.handler',
      requestModelType: BrazeUpdateModel,
    }),
  };
}
