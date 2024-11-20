import { Route } from '@blc-mono/members/infrastructure/routes/route';
import { ApiGatewayV1Api, Stack, Table } from 'sst/constructs';
import { ApiGatewayModelGenerator } from '@blc-mono/core/extensions/apiGatewayExtension';
import { ApiGatewayV1ApiRouteProps } from 'sst/constructs/ApiGatewayV1Api';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { CardPrintBatchModel } from '@blc-mono/members/application/models/cardPrintBatchModel';
import { CardModel } from '@blc-mono/members/application/models/cardModel';

export function adminCardRoutes(
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
    'GET /admin/cards/{memberId}': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminGetCards',
      handler: 'packages/api/members/application/handlers/admin/cards/getCards.handler',
      responseModel: apiGatewayModelGenerator.generateModel(CardModel),
    }),
    'GET /admin/cards/{memberId}/{cardNumber}': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminGetCard',
      handler: 'packages/api/members/application/handlers/admin/cards/getCard.handler',
      responseModel: apiGatewayModelGenerator.generateModel(CardModel),
    }),
    'PUT /admin/cards/{memberId}': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminUpdateCard',
      handler: 'packages/api/members/application/handlers/admin/cards/updateCard.handler',
      requestModel: apiGatewayModelGenerator.generateModel(CardModel),
    }),
    'GET /admin/cards/batches': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminGetCardPrintBatches',
      handler:
        'packages/api/members/application/handlers/admin/cards/batch/getCardPrintBatches.handler',
      responseModel: apiGatewayModelGenerator.generateModel(CardPrintBatchModel),
    }),
    'GET /admin/cards/batches/{batchId}': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminGetCardPrintBatch',
      handler:
        'packages/api/members/application/handlers/admin/cards/batch/getCardPrintBatch.handler',
      responseModel: apiGatewayModelGenerator.generateModel(CardPrintBatchModel),
    }),
    'POST /admin/cards/batches': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminCreateCardPrintBatch',
      handler:
        'packages/api/members/application/handlers/admin/cards/batch/createCardPrintBatch.handler',
      requestModel: apiGatewayModelGenerator.generateModel(CardPrintBatchModel),
    }),
    'PUT /admin/cards/batches/{batchId}': Route.createRoute({
      ...defaultRouteParams,
      name: 'AdminUpdateCardPrintBatch',
      handler:
        'packages/api/members/application/handlers/admin/cards/batch/updateCardPrintBatch.handler',
      requestModel: apiGatewayModelGenerator.generateModel(CardPrintBatchModel),
    }),
  };
}
