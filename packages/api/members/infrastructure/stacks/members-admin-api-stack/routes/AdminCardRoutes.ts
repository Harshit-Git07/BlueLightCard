import {
  AwaitingBatchingCardModel,
  BatchedCardModel,
  CardModel,
  UpdateCardModel,
} from '@blc-mono/shared/models/members/cardModel';
import { AdminRoutes } from '@blc-mono/members/infrastructure/stacks/members-admin-api-stack/routes/types/adminRoutes';
import {
  createRoute,
  DefaultRouteProps,
} from '@blc-mono/members/infrastructure/stacks/shared/rest-api/builders/route';

export function adminCardRoutes(defaultRouteProps: DefaultRouteProps): AdminRoutes {
  return {
    'GET /admin/members/{memberId}/cards': createRoute({
      ...defaultRouteProps,
      name: 'AdminGetCards',
      handler: 'packages/api/members/application/handlers/admin/cards/getCards.handler',
      responseModelType: CardModel,
    }),
    'GET /admin/members/{memberId}/cards/{cardNumber}': createRoute({
      ...defaultRouteProps,
      name: 'AdminGetCard',
      handler: 'packages/api/members/application/handlers/admin/cards/getCard.handler',
      responseModelType: CardModel,
    }),
    'PUT /admin/members/{memberId}/cards/{cardNumber}': createRoute({
      ...defaultRouteProps,
      name: 'AdminUpdateCard',
      handler: 'packages/api/members/application/handlers/admin/cards/updateCard.handler',
      requestModelType: UpdateCardModel,
    }),
    'GET /admin/cards/inBatch/{batchId}': createRoute({
      ...defaultRouteProps,
      name: 'AdminGetCardsInBatch',
      handler: 'packages/api/members/application/handlers/admin/cards/getCardsInBatch.handler',
      responseModelType: BatchedCardModel,
    }),
    'GET /admin/cards/awaitingBatching': createRoute({
      ...defaultRouteProps,
      name: 'AdminGetCardsAwaitingBatching',
      handler:
        'packages/api/members/application/handlers/admin/cards/getCardsAwaitingBatching.handler',
      responseModelType: AwaitingBatchingCardModel,
    }),
  };
}
