import { DefaultRouteProps, Route } from '@blc-mono/members/infrastructure/routes/route';
import { ApiGatewayV1ApiFunctionRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import { CreateInternalBatchModel } from '@blc-mono/members/application/models/batchModel';

export function adminBatchRoutes(
  defaultRouteProps: DefaultRouteProps,
): Record<string, ApiGatewayV1ApiFunctionRouteProps<never>> {
  return {
    'POST /admin/batches/internal': Route.createRoute({
      ...defaultRouteProps,
      name: 'createInternalBatch',
      handler: 'packages/api/members/application/handlers/admin/batch/createInternalBatch.handler',
      requestModelType: CreateInternalBatchModel,
    }),
  };
}
