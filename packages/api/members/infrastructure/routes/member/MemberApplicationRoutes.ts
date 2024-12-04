import { DefaultRouteProps, Route } from '@blc-mono/members/infrastructure/routes/route';
import { ApiGatewayV1ApiFunctionRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import {
  ApplicationModel,
  CreateApplicationModel,
  CreateApplicationModelResponse,
  UpdateApplicationModel,
} from '@blc-mono/members/application/models/applicationModel';
import { DocumentUploadLocation } from '@blc-mono/members/application/models/documentUpload';

export function memberApplicationRoutes(
  defaultRouteProps: DefaultRouteProps,
): Record<string, ApiGatewayV1ApiFunctionRouteProps<never>> {
  return {
    'POST /members/{memberId}/applications': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberCreateApplication',
      handler:
        'packages/api/members/application/handlers/member/applications/createApplication.handler',
      requestModelType: CreateApplicationModel,
      responseModelType: CreateApplicationModelResponse,
    }),
    'PUT /members/{memberId}/applications/{applicationId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberUpdateApplication',
      handler:
        'packages/api/members/application/handlers/member/applications/updateApplication.handler',
      requestModelType: UpdateApplicationModel,
    }),
    'GET /members/{memberId}/applications': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberGetApplications',
      handler:
        'packages/api/members/application/handlers/member/applications/getApplications.handler',
      responseModelType: ApplicationModel,
    }),
    'GET /members/{memberId}/applications/{applicationId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberGetApplication',
      handler:
        'packages/api/members/application/handlers/member/applications/getApplication.handler',
      responseModelType: ApplicationModel,
    }),
    'POST /members/{memberId}/applications/{applicationId}/uploadDocument': Route.createRoute({
      ...defaultRouteProps,
      name: 'MemberUploadDocument',
      handler:
        'packages/api/members/application/handlers/member/applications/uploadDocument.handler',
      responseModelType: DocumentUploadLocation,
    }),
  };
}
