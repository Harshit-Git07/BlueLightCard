import { DefaultRouteProps, Route } from '@blc-mono/members/infrastructure/routes/route';
import { ApiGatewayV1ApiFunctionRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import {
  ApplicationModel,
  CreateApplicationModel,
  CreateApplicationModelResponse,
  UpdateApplicationModel,
} from '@blc-mono/shared/models/members/applicationModel';
import {
  ApplicationBatchApprovalModel,
  ApplicationBatchModel,
} from '@blc-mono/shared/models/members/applicationApprovalModel';
import {
  DocumentListPresignedUrl,
  DocumentUploadLocation,
} from '@blc-mono/shared/models/members/documentUpload';

export function adminApplicationRoutes(
  defaultRouteProps: DefaultRouteProps,
): Record<string, ApiGatewayV1ApiFunctionRouteProps<'memberAuthorizer'>> {
  return {
    'POST /admin/members/{memberId}/applications': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminCreateApplication',
      handler:
        'packages/api/members/application/handlers/admin/applications/createApplication.handler',
      requestModelType: CreateApplicationModel,
      responseModelType: CreateApplicationModelResponse,
    }),
    'PUT /admin/members/{memberId}/applications/{applicationId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminUpdateApplication',
      handler:
        'packages/api/members/application/handlers/admin/applications/updateApplication.handler',
      requestModelType: UpdateApplicationModel,
    }),
    'GET /admin/members/{memberId}/applications': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetApplications',
      handler:
        'packages/api/members/application/handlers/admin/applications/getApplications.handler',
      responseModelType: ApplicationModel,
    }),
    'GET /admin/members/{memberId}/applications/{applicationId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetApplication',
      handler:
        'packages/api/members/application/handlers/admin/applications/getApplication.handler',
      responseModelType: ApplicationModel,
    }),
    'GET /admin/members/{memberId}/applications/{applicationId}/documents': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetDocuments',
      handler: 'packages/api/members/application/handlers/admin/applications/getDocuments.handler',
      responseModelType: DocumentListPresignedUrl,
    }),
    'POST /admin/members/{memberId}/applications/{applicationId}/uploadDocument': Route.createRoute(
      {
        ...defaultRouteProps,
        name: 'AdminUploadDocument',
        handler:
          'packages/api/members/application/handlers/admin/applications/uploadDocument.handler',
        responseModelType: DocumentUploadLocation,
      },
    ),
    'POST /admin/members/applications/approvals': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminAssignApplicationApprovals',
      handler:
        'packages/api/members/application/handlers/admin/applications/approvals/assignApplicationApprovals.handler',
      requestModelType: ApplicationBatchApprovalModel,
      responseModelType: ApplicationBatchApprovalModel,
    }),
    'GET /admin/members/applications/approvals': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetApplicationsForApproval',
      handler:
        'packages/api/members/application/handlers/admin/applications/approvals/getApplicationsForApproval.handler',
      responseModelType: ApplicationBatchModel,
    }),
    'DELETE /admin/members/applications/approvals': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminReleaseApplicationApprovals',
      handler:
        'packages/api/members/application/handlers/admin/applications/approvals/releaseApplicationApprovals.handler',
      requestModelType: ApplicationBatchApprovalModel,
    }),
    'PUT /admin/members/{memberId}/applications/{applicationId}/approve': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminApproveApplication',
      handler:
        'packages/api/members/application/handlers/admin/applications/approvals/approveApplication.handler',
    }),
    'PUT /admin/members/{memberId}/applications/{applicationId}/reject': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminRejectApplication',
      handler:
        'packages/api/members/application/handlers/admin/applications/approvals/rejectApplication.handler',
    }),
  };
}
