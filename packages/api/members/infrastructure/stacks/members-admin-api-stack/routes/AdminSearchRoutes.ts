import { MemberDocumentsSearchResponseModel } from '@blc-mono/shared/models/members/memberDocument';
import { IVpc } from 'aws-cdk-lib/aws-ec2';
import { AdminRoutes } from '@blc-mono/members/infrastructure/stacks/members-admin-api-stack/routes/types/adminRoutes';
import {
  createRoute,
  DefaultRouteProps,
} from '@blc-mono/members/infrastructure/stacks/shared/rest-api/builders/route';

export function adminSearchRoutes(defaultRouteProps: DefaultRouteProps, vpc: IVpc): AdminRoutes {
  return {
    'GET /admin/members/search': createRoute({
      ...defaultRouteProps,
      name: 'AdminGetMembersSearch',
      handler: 'packages/api/members/application/handlers/admin/search/memberSearch.handler',
      responseModelType: MemberDocumentsSearchResponseModel,
      vpc,
      permissions: ['es'],
    }),
  };
}
