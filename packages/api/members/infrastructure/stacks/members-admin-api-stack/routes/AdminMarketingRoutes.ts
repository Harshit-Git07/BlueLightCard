import { Function } from 'sst/constructs';
import { BrazeAttributesModel } from '@blc-mono/shared/models/members/brazeAttributesModel';
import { MarketingPreferencesModel } from '@blc-mono/shared/models/members/marketingPreferences';
import { BrazeUpdateModel } from '@blc-mono/shared/models/members/brazeUpdateModel';
import { AdminRoutes } from '@blc-mono/members/infrastructure/stacks/members-admin-api-stack/routes/types/adminRoutes';
import {
  createRoute,
  DefaultRouteProps,
} from '@blc-mono/members/infrastructure/stacks/shared/rest-api/builders/route';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/environment';

export function adminMarketingRoutes(defaultRouteProps: DefaultRouteProps): AdminRoutes {
  const singleAdminMarketingHandler = new Function(
    defaultRouteProps.stack,
    'AdminMarketingHandlerFunction',
    {
      bind: defaultRouteProps.bind,
      permissions: defaultRouteProps.permissions,
      handler:
        'packages/api/members/application/handlers/admin/marketing/adminMarketingHandler.handler',
      environment: {
        [MemberStackEnvironmentKeys.SERVICE]: 'members',
        ...defaultRouteProps.environment,
        [MemberStackEnvironmentKeys.API_DEFAULT_ALLOWED_ORIGINS]: JSON.stringify(
          defaultRouteProps.defaultAllowedOrigins,
        ),
      },
      vpc: defaultRouteProps.vpc,
    },
  );

  return {
    'GET /admin/members/{memberId}/marketing/preferences/{environment}': createRoute({
      ...defaultRouteProps,
      name: 'AdminGetMarketingPreferences',
      responseModelType: MarketingPreferencesModel,
      handlerFunction: singleAdminMarketingHandler,
      permissions: ['secretsmanager:GetSecretValue'],
    }),
    'POST /admin/members/{memberId}/marketing/braze': createRoute({
      ...defaultRouteProps,
      name: 'AdminFetchBrazeAttributes',
      responseModelType: BrazeAttributesModel,
      handlerFunction: singleAdminMarketingHandler,
    }),
    'POST /admin/members/{memberId}/marketing/braze/update': createRoute({
      ...defaultRouteProps,
      name: 'AdminUpdateMarketingPreferences',
      responseModelType: BrazeUpdateModel,
      handlerFunction: singleAdminMarketingHandler,
    }),
  };
}
