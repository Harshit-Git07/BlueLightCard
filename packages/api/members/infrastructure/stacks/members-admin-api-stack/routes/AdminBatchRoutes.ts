import {
  BatchModel,
  CreateInternalBatchModel,
  ExtendedBatchModel,
  FixBatchModelRequest,
  UpdateInternalBatchModel,
} from '@blc-mono/shared/models/members/batchModel';
import { Function } from 'sst/constructs';
import { CardPrintBatchModel } from '@blc-mono/shared/models/members/cardPrintBatchModel';
import { AdminRoutes } from '@blc-mono/members/infrastructure/stacks/members-admin-api-stack/routes/types/adminRoutes';
import {
  createRoute,
  DefaultRouteProps,
} from '@blc-mono/members/infrastructure/stacks/shared/rest-api/builders/route';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/environment';

export function adminBatchRoutes(defaultRouteProps: DefaultRouteProps): AdminRoutes {
  const adminBatchHandler = new Function(defaultRouteProps.stack, 'AdminBatchHandlerFunction', {
    bind: defaultRouteProps.bind,
    permissions: defaultRouteProps.permissions,
    handler:
      'packages/api/members/application/handlers/admin/batch/routes/adminBatchHandler.handler',
    environment: {
      [MemberStackEnvironmentKeys.SERVICE]: 'members',
      ...defaultRouteProps.environment,
      [MemberStackEnvironmentKeys.API_DEFAULT_ALLOWED_ORIGINS]: JSON.stringify(
        defaultRouteProps.defaultAllowedOrigins,
      ),
    },
    vpc: defaultRouteProps.vpc,
  });

  return {
    'GET /admin/batches/internal': createRoute({
      ...defaultRouteProps,
      name: 'AdminOpenInternalBatches',
      responseModelType: BatchModel,
      handlerFunction: adminBatchHandler,
    }),
    'POST /admin/batches/internal': createRoute({
      ...defaultRouteProps,
      name: 'AdminCreateInternalBatch',
      requestModelType: CreateInternalBatchModel,
      handlerFunction: adminBatchHandler,
    }),
    'PUT /admin/batches/internal': createRoute({
      ...defaultRouteProps,
      name: 'AdminUpdateInternalBatch',
      requestModelType: UpdateInternalBatchModel,
      handlerFunction: adminBatchHandler,
    }),
    'GET /admin/batches/all': createRoute({
      ...defaultRouteProps,
      name: 'AdminGetBatches',
      responseModelType: ExtendedBatchModel,
      handlerFunction: adminBatchHandler,
    }),
    'GET /admin/cards/batches': createRoute({
      ...defaultRouteProps,
      name: 'AdminGetCardPrintBatches',
      responseModelType: CardPrintBatchModel,
      handlerFunction: adminBatchHandler,
    }),
    'POST /admin/cards/batches': createRoute({
      ...defaultRouteProps,
      name: 'AdminCreateCardPrintBatch',
      requestModelType: CardPrintBatchModel,
      handlerFunction: adminBatchHandler,
    }),
    'GET /admin/cards/batches/{batchId}': createRoute({
      ...defaultRouteProps,
      name: 'AdminGetCardPrintBatch',
      responseModelType: CardPrintBatchModel,
      handlerFunction: adminBatchHandler,
    }),
    'PUT /admin/cards/batches/{batchId}': createRoute({
      ...defaultRouteProps,
      name: 'AdminUpdateCardPrintBatch',
      requestModelType: CardPrintBatchModel,
      handlerFunction: adminBatchHandler,
    }),
    'POST /admin/cards/batches/{batchId}/fix': createRoute({
      ...defaultRouteProps,
      name: 'AdminFixCardPrintBatch',
      requestModelType: FixBatchModelRequest,
      handlerFunction: adminBatchHandler,
    }),
  };
}
