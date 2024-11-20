import { Route, RouteOptions } from '@blc-mono/members/infrastructure/routes/route';
import { Stack, Table } from 'sst/constructs';
import { ApiGatewayModelGenerator } from '@blc-mono/core/extensions/apiGatewayExtension';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { MarketingPreferencesModel } from '@blc-mono/members/application/models/marketingPreferences';
import { BrazeAttributesModel } from '@blc-mono/members/application/models/brazeAttributesModel';

export function memberMarketingRoutes(
  stack: Stack,
  restApi: RestApi,
  apiGatewayModelGenerator: ApiGatewayModelGenerator,
): Record<string, ApiGatewayV1ApiRouteProps<never>> {
  const defaultRouteParams = {
    stack,
    restApi,
    defaultAllowedOrigins: ['*'],
    apiGatewayModelGenerator,
    permissions: ['secretsmanager:GetSecretValue'],
  };

  return {
    'POST /members/marketing/braze/{memberId}': Route.createRoute({
      ...defaultRouteParams,
      name: 'MemberFetchBrazeAttributes',
      handler:
        'packages/api/members/application/handlers/member/marketing/getBrazeAttributes.handler',
      requestModel: apiGatewayModelGenerator.generateModel(BrazeAttributesModel),
    }),
    'GET /members/marketing/preferences/{memberId}/{environment}': Route.createRoute({
      ...defaultRouteParams,
      name: 'MemberGetMarketingPreferences',
      handler:
        'packages/api/members/application/handlers/member/marketing/getMarketingPreferences.handler',
      responseModel: apiGatewayModelGenerator.generateModel(MarketingPreferencesModel),
    }),
    'PUT /members/marketing/preferences/{memberId}/{environment}': Route.createRoute({
      ...defaultRouteParams,
      name: 'MemberUpdateMarketingPreferences',
      handler:
        'packages/api/members/application/handlers/member/marketing/updateMarketingPreferences.handler',
      requestModel: apiGatewayModelGenerator.generateModel(MarketingPreferencesModel),
    }),
  };
}
