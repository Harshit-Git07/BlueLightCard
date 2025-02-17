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
import { AdminRoutes } from '@blc-mono/members/infrastructure/stacks/members-admin-api-stack/routes/types/adminRoutes';
import {
  createRoute,
  DefaultRouteProps,
} from '@blc-mono/members/infrastructure/stacks/shared/rest-api/builders/route';

export function adminApplicationRoutes(defaultRouteProps: DefaultRouteProps): AdminRoutes {
  return {
    'GET /admin/members/{memberId}/applications': createRoute({
      ...defaultRouteProps,
      name: 'AdminGetApplications',
      handler:
        'packages/api/members/application/handlers/admin/applications/getApplications.handler',
      responseModelType: ApplicationModel,
    }),
    'GET /admin/members/{memberId}/applications/{applicationId}': createRoute({
      ...defaultRouteProps,
      name: 'AdminGetApplication',
      handler:
        'packages/api/members/application/handlers/admin/applications/getApplication.handler',
      responseModelType: ApplicationModel,
    }),
    'POST /admin/members/{memberId}/applications': createRoute({
      ...defaultRouteProps,
      name: 'AdminCreateApplication',
      handler:
        'packages/api/members/application/handlers/admin/applications/createApplication.handler',
      requestModelType: CreateApplicationModel,
      responseModelType: CreateApplicationModelResponse,
    }),
    'PUT /admin/members/{memberId}/applications/{applicationId}': createRoute({
      ...defaultRouteProps,
      name: 'AdminUpdateApplication',
      handler:
        'packages/api/members/application/handlers/admin/applications/updateApplication.handler',
      requestModelType: UpdateApplicationModel,
    }),
    'GET /admin/members/{memberId}/applications/{applicationId}/documents': createRoute({
      ...defaultRouteProps,
      name: 'AdminGetDocuments',
      handler: 'packages/api/members/application/handlers/admin/applications/getDocuments.handler',
      responseModelType: DocumentListPresignedUrl,
    }),
    'POST /admin/members/{memberId}/applications/{applicationId}/uploadDocument': createRoute({
      ...defaultRouteProps,
      name: 'AdminUploadDocument',
      handler:
        'packages/api/members/application/handlers/admin/applications/uploadDocument.handler',
      responseModelType: DocumentUploadLocation,
    }),
    'GET /admin/members/applications/approvals': createRoute({
      ...defaultRouteProps,
      name: 'AdminGetApplicationsForApproval',
      handler:
        'packages/api/members/application/handlers/admin/applications/approvals/getApplicationsForApproval.handler',
      responseModelType: ApplicationBatchModel,
    }),
    'POST /admin/members/applications/approvals': createRoute({
      ...defaultRouteProps,
      name: 'AdminAssignApplicationApprovals',
      handler:
        'packages/api/members/application/handlers/admin/applications/approvals/assignApplicationApprovals.handler',
      requestModelType: ApplicationBatchApprovalModel,
      responseModelType: ApplicationBatchApprovalModel,
    }),
    'DELETE /admin/members/applications/approvals': createRoute({
      ...defaultRouteProps,
      name: 'AdminReleaseApplicationApprovals',
      handler:
        'packages/api/members/application/handlers/admin/applications/approvals/releaseApplicationApprovals.handler',
      requestModelType: ApplicationBatchApprovalModel,
    }),
    'PUT /admin/members/{memberId}/applications/{applicationId}/approve': createRoute({
      ...defaultRouteProps,
      name: 'AdminApproveApplication',
      handler:
        'packages/api/members/application/handlers/admin/applications/approvals/approveApplication.handler',
    }),
    'PUT /admin/members/{memberId}/applications/{applicationId}/reject': createRoute({
      ...defaultRouteProps,
      name: 'AdminRejectApplication',
      handler:
        'packages/api/members/application/handlers/admin/applications/approvals/rejectApplication.handler',
    }),
  };
}
