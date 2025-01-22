import { DefaultRouteProps, Route } from '@blc-mono/members/infrastructure/routes/route';
import { ApiGatewayV1ApiFunctionRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import {
  MemberDocumentsSearchModel,
  MemberDocumentsSearchResponseModel,
} from '@blc-mono/shared/models/members/memberDocument';
import { IVpc } from 'aws-cdk-lib/aws-ec2';

export function adminSearchRoutes(
  defaultRouteProps: DefaultRouteProps,
  vpc: IVpc,
): Record<string, ApiGatewayV1ApiFunctionRouteProps<'memberAuthorizer'>> {
  return {
    'GET /admin/members/search': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetMembersSearch',
      handler: 'packages/api/members/application/handlers/admin/search/memberSearch.handler',
      requestModelType: MemberDocumentsSearchModel,
      responseModelType: MemberDocumentsSearchResponseModel,
      vpc,
      permissions: ['es'],
    }),
  };
}
