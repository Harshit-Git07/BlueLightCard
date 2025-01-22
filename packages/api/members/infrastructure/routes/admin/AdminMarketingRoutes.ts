import { DefaultRouteProps, Route } from '@blc-mono/members/infrastructure/routes/route';
import { ApiGatewayV1ApiFunctionRouteProps, Function } from 'sst/constructs';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/constants/environment';
import { BrazeAttributesModel } from '@blc-mono/shared/models/members/brazeAttributesModel';
import { MarketingPreferencesModel } from '@blc-mono/shared/models/members/marketingPreferences';
import { BrazeUpdateModel } from '@blc-mono/shared/models/members/brazeUpdateModel';

export function adminMarketingRoutes(
  defaultRouteProps: DefaultRouteProps,
): Record<string, ApiGatewayV1ApiFunctionRouteProps<'memberAuthorizer'>> {
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
    'POST /admin/members/{memberId}/marketing/braze': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminFetchBrazeAttributes',
      responseModelType: BrazeAttributesModel,
      handlerFunction: singleAdminMarketingHandler,
    }),
    'GET /admin/members/{memberId}/marketing/preferences/{environment}': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetMarketingPreferences',
      responseModelType: MarketingPreferencesModel,
      handlerFunction: singleAdminMarketingHandler,
      permissions: ['secretsmanager:GetSecretValue'],
    }),
    'POST /admin/members/{memberId}/marketing/braze/update': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminUpdateMarketingPreferences',
      responseModelType: BrazeUpdateModel,
      handlerFunction: singleAdminMarketingHandler,
    }),
  };
}
