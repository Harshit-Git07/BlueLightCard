import { DefaultRouteProps, Route } from '@blc-mono/members/infrastructure/routes/route';
import { ApiGatewayV1ApiFunctionRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import {
  ExtendedBatchModel,
  CreateInternalBatchModel,
  UpdateInternalBatchModel,
  BatchModel,
  FixBatchModelRequest,
} from '@blc-mono/shared/models/members/batchModel';
import { Function } from 'sst/constructs';
import { MemberStackEnvironmentKeys } from '@blc-mono/members/infrastructure/constants/environment';
import { CardPrintBatchModel } from '@blc-mono/shared/models/members/cardPrintBatchModel';

export function adminBatchRoutes(
  defaultRouteProps: DefaultRouteProps,
): Record<string, ApiGatewayV1ApiFunctionRouteProps<'memberAuthorizer'>> {
  const singleAdminBatchHandler = new Function(
    defaultRouteProps.stack,
    'AdminBatchHandlerFunction',
    {
      bind: defaultRouteProps.bind,
      permissions: defaultRouteProps.permissions,
      handler: 'packages/api/members/application/handlers/admin/batch/adminBatchHandler.handler',
      environment: {
        [MemberStackEnvironmentKeys.SERVICE]: 'members',
        ...defaultRouteProps.environment,
        [MemberStackEnvironmentKeys.API_DEFAULT_ALLOWED_ORIGINS]: JSON.stringify(
          defaultRouteProps.defaultAllowedOrigins,
        ),
      },
      vpc: defaultRouteProps.vpc,
    },
  );

  return {
    'POST /admin/batches/internal': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminCreateInternalBatch',
      requestModelType: CreateInternalBatchModel,
      handlerFunction: singleAdminBatchHandler,
    }),
    'PUT /admin/batches/internal': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminUpdateInternalBatch',
      requestModelType: UpdateInternalBatchModel,
      handlerFunction: singleAdminBatchHandler,
    }),
    'GET /admin/batches/internal': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminOpenInternalBatches',
      responseModelType: BatchModel,
      handlerFunction: singleAdminBatchHandler,
    }),
    'GET /admin/batches/all': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetBatches',
      responseModelType: ExtendedBatchModel,
      handlerFunction: singleAdminBatchHandler,
    }),
    'GET /admin/cards/batches': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetCardPrintBatches',
      responseModelType: CardPrintBatchModel,
      handlerFunction: singleAdminBatchHandler,
    }),
    'GET /admin/cards/batches/{batchId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetCardPrintBatch',
      responseModelType: CardPrintBatchModel,
      handlerFunction: singleAdminBatchHandler,
    }),
    'POST /admin/cards/batches': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminCreateCardPrintBatch',
      requestModelType: CardPrintBatchModel,
      handlerFunction: singleAdminBatchHandler,
    }),
    'PUT /admin/cards/batches/{batchId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminUpdateCardPrintBatch',
      requestModelType: CardPrintBatchModel,
      handlerFunction: singleAdminBatchHandler,
    }),
    'POST /admin/cards/batches/{batchId}/fix': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminFixCardPrintBatch',
      requestModelType: FixBatchModelRequest,
      handlerFunction: singleAdminBatchHandler,
    }),
  };
}
