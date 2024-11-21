import { DefaultRouteProps, Route } from '@blc-mono/members/infrastructure/routes/route';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import { ApprovalAllocationModel } from '@blc-mono/members/application/models/approvalAllocationModel';

export function adminAllocationRoutes(
  defaultRouteProps: DefaultRouteProps,
): Record<string, ApiGatewayV1ApiRouteProps<never>> {
  return {
    'GET /admin/allocations': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetAllocations',
      handler: 'packages/api/members/application/handlers/admin/allocations/getAllocations.handler',
      responseModelType: ApprovalAllocationModel,
    }),
    'POST /admin/allocations/{adminId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminCreateAllocation',
      handler:
        'packages/api/members/application/handlers/admin/allocations/createAllocation.handler',
      requestModelType: ApprovalAllocationModel,
    }),
    'PUT /admin/allocations/{adminId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminUpdateAllocation',
      handler:
        'packages/api/members/application/handlers/admin/allocations/updateAllocation.handler',
      requestModelType: ApprovalAllocationModel,
    }),
    'DELETE /admin/allocations/{adminId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminDeleteAllocation',
      handler:
        'packages/api/members/application/handlers/admin/allocations/deleteAllocation.handler',
    }),
  };
}
