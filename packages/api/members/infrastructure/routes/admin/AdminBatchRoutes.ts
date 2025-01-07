import { DefaultRouteProps, Route } from '@blc-mono/members/infrastructure/routes/route';
import { ApiGatewayV1ApiFunctionRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import {
  ExtendedBatchModel,
  CreateInternalBatchModel,
  UpdateInternalBatchModel,
  BatchModel,
} from '@blc-mono/members/application/models/batchModel';

export function adminBatchRoutes(
  defaultRouteProps: DefaultRouteProps,
): Record<string, ApiGatewayV1ApiFunctionRouteProps<'memberAuthorizer'>> {
  return {
    'POST /admin/batches/internal': Route.createRoute({
      ...defaultRouteProps,
      name: 'createInternalBatch',
      handler: 'packages/api/members/application/handlers/admin/batch/createInternalBatch.handler',
      requestModelType: CreateInternalBatchModel,
    }),
    'PUT /admin/batches/internal': Route.createRoute({
      ...defaultRouteProps,
      name: 'updateInternalBatch',
      handler: 'packages/api/members/application/handlers/admin/batch/updateInternalBatch.handler',
      requestModelType: UpdateInternalBatchModel,
    }),
    'GET /admin/batches/internal': Route.createRoute({
      ...defaultRouteProps,
      name: 'openInternalBatches',
      handler: 'packages/api/members/application/handlers/admin/batch/openInternalBatches.handler',
      responseModelType: BatchModel,
    }),
    'GET /admin/batches/all': Route.createRoute({
      ...defaultRouteProps,
      name: 'getBatches',
      handler: 'packages/api/members/application/handlers/admin/batch/getBatches.handler',
      responseModelType: ExtendedBatchModel,
    }),
  };
}
