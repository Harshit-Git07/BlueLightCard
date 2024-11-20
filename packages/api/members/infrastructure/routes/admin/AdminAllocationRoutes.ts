import { Route } from '@blc-mono/members/infrastructure/routes/route';
import { ApiGatewayV1Api, Stack, Table } from 'sst/constructs';
import { ApiGatewayModelGenerator } from '@blc-mono/core/extensions/apiGatewayExtension';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { ApprovalAllocationModel } from '@blc-mono/members/application/models/approvalAllocationModel';

export function adminAllocationRoutes(
  stack: Stack,
  restApi: RestApi,
  apiGatewayModelGenerator: ApiGatewayModelGenerator,
  adminTable: Table,
): Record<string, ApiGatewayV1ApiRouteProps<never>> {
  const defaultRouteParams = {
    stack,
    restApi,
    defaultAllowedOrigins: ['*'],
    apiGatewayModelGenerator,
    bind: [adminTable],
  };

  return {
    'GET /admin/allocations': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminGetAllocations',
      handler: 'packages/api/members/application/handlers/admin/allocations/getAllocations.handler',
      responseModel: apiGatewayModelGenerator.generateModel(ApprovalAllocationModel),
    }),
    'POST /admin/allocations/{adminId}': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminCreateAllocation',
      handler:
        'packages/api/members/application/handlers/admin/allocations/createAllocation.handler',
      requestModel: apiGatewayModelGenerator.generateModel(ApprovalAllocationModel),
    }),
    'PUT /admin/allocations/{adminId}': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminUpdateAllocation',
      handler:
        'packages/api/members/application/handlers/admin/allocations/updateAllocation.handler',
      requestModel: apiGatewayModelGenerator.generateModel(ApprovalAllocationModel),
    }),
    'DELETE /admin/allocations/{adminId}': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminDeleteAllocation',
      handler:
        'packages/api/members/application/handlers/admin/allocations/deleteAllocation.handler',
    }),
  };
}
