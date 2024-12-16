import { DefaultRouteProps, Route } from '@blc-mono/members/infrastructure/routes/route';
import { ApiGatewayV1ApiFunctionRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import { CardPrintBatchModel } from '@blc-mono/members/application/models/cardPrintBatchModel';
import { CardModel, UpdateCardModel } from '@blc-mono/members/application/models/cardModel';
import { FixBatchModelRequest } from '@blc-mono/members/application/models/batchModel';

export function adminCardRoutes(
  defaultRouteProps: DefaultRouteProps,
): Record<string, ApiGatewayV1ApiFunctionRouteProps<never>> {
  return {
    'GET /admin/members/{memberId}/cards': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetCards',
      handler: 'packages/api/members/application/handlers/admin/cards/getCards.handler',
      responseModelType: CardModel,
    }),
    'GET /admin/members/{memberId}/cards/{cardNumber}': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetCard',
      handler: 'packages/api/members/application/handlers/admin/cards/getCard.handler',
      responseModelType: CardModel,
    }),
    'PUT /admin/members/{memberId}/cards/{cardNumber}': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminUpdateCard',
      handler: 'packages/api/members/application/handlers/admin/cards/updateCard.handler',
      requestModelType: UpdateCardModel,
    }),
    'GET /admin/cards/batches': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetCardPrintBatches',
      handler: 'packages/api/members/application/handlers/admin/batch/getCardPrintBatches.handler',
      responseModelType: CardPrintBatchModel,
    }),
    'GET /admin/cards/batches/{batchId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminGetCardPrintBatch',
      handler: 'packages/api/members/application/handlers/admin/batch/getCardPrintBatch.handler',
      responseModelType: CardPrintBatchModel,
    }),
    'POST /admin/cards/batches': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminCreateCardPrintBatch',
      handler: 'packages/api/members/application/handlers/admin/batch/createCardPrintBatch.handler',
      requestModelType: CardPrintBatchModel,
    }),
    'PUT /admin/cards/batches/{batchId}': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminUpdateCardPrintBatch',
      handler: 'packages/api/members/application/handlers/admin/batch/updateCardPrintBatch.handler',
      requestModelType: CardPrintBatchModel,
    }),
    'POST /admin/cards/batches/{batchId}/fix': Route.createRoute({
      ...defaultRouteProps,
      name: 'AdminFixCardPrintBatch',
      handler: 'packages/api/members/application/handlers/admin/batch/fixBatch.handler',
      requestModelType: FixBatchModelRequest,
    }),
  };
}
