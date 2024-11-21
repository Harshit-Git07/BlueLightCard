import { DefaultRouteProps, Route } from '@blc-mono/members/infrastructure/routes/route';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import {
  ApplicationModel,
  CreateApplicationModel,
  UpdateApplicationModel,
} from '@blc-mono/members/application/models/applicationModel';
import { DocumentUploadLocation } from '@blc-mono/members/application/models/documentUpload';

export function adminApplicationRoutes(
  defaultRouteProps: DefaultRouteProps,
): Record<string, ApiGatewayV1ApiRouteProps<never>> {
  return {
    'POST /admin/members/applications': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminCreateApplication',
      handler:
        'packages/api/members/application/handlers/admin/applications/createApplication.handler',
      requestModelType: CreateApplicationModel,
    }),
    'PUT /admin/members/applications': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminUpdateApplication',
      handler:
        'packages/api/members/application/handlers/admin/applications/updateApplication.handler',
      requestModelType: UpdateApplicationModel,
    }),
    'GET /admin/members/applications': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetAllApplications',
      handler:
        'packages/api/members/application/handlers/admin/applications/getAllApplications.handler',
      responseModelType: ApplicationModel,
    }),
    'GET /admin/members/applications/{memberId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetApplications',
      handler:
        'packages/api/members/application/handlers/admin/applications/getApplications.handler',
      responseModelType: ApplicationModel,
    }),
    'GET /admin/members/applications/{memberId}/{applicationId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetApplication',
      handler:
        'packages/api/members/application/handlers/admin/applications/getApplication.handler',
      responseModelType: ApplicationModel,
    }),
    'POST /admin/members/applications/{memberId}/{applicationId}/uploadDocument': Route.createRoute(
      {
        ...defaultRouteProps,
        name: 'AdminUploadDocument',
        handler:
          'packages/api/members/application/handlers/admin/applications/uploadDocument.handler',
        responseModelType: DocumentUploadLocation,
      },
    ),
  };
}
