import { DefaultRouteProps, Route } from '@blc-mono/members/infrastructure/routes/route';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import {
  ApplicationModel,
  CreateApplicationModel,
  UpdateApplicationModel,
} from '@blc-mono/members/application/models/applicationModel';
import { DocumentUploadLocation } from '@blc-mono/members/application/models/documentUpload';

export function memberApplicationRoutes(
  defaultRouteProps: DefaultRouteProps,
): Record<string, ApiGatewayV1ApiRouteProps<never>> {
  return {
    'POST /members/applications': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberCreateApplication',
      handler:
        'packages/api/members/application/handlers/member/applications/createApplication.handler',
      requestModelType: CreateApplicationModel,
    }),
    'PUT /members/applications': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberUpdateApplication',
      handler:
        'packages/api/members/application/handlers/member/applications/updateApplication.handler',
      requestModelType: UpdateApplicationModel,
    }),
    'GET /members/applications/{memberId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberGetApplications',
      handler:
        'packages/api/members/application/handlers/member/applications/getApplications.handler',
      responseModelType: ApplicationModel,
    }),
    'GET /members/applications/{memberId}/{applicationId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberGetApplication',
      handler:
        'packages/api/members/application/handlers/member/applications/getApplication.handler',
      responseModelType: ApplicationModel,
    }),
    'GET /members/applications/{memberId}/{applicationId}/uploadDocument': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberUploadDocument',
      handler:
        'packages/api/members/application/handlers/member/applications/uploadDocument.handler',
      responseModelType: DocumentUploadLocation,
    }),
  };
}
