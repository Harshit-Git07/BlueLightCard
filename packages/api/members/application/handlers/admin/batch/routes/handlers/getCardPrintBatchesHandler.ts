import { APIGatewayProxyEvent } from 'aws-lambda';
import { CardPrintBatchModel } from '@blc-mono/shared/models/members/cardPrintBatchModel';

export function isGetCardPrintBatchesRoute(event: APIGatewayProxyEvent): boolean {
  return event.httpMethod === 'GET' && event.path === `/admin/cards/batches`;
}

export async function getCardPrintBatchesHandler(
  // TODO: Implement this and then remove the eslint disable
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  event: APIGatewayProxyEvent,
): Promise<CardPrintBatchModel[]> {
  // TODO: Actually implement this
  return [
    {
      cardNumbers: ['ABC123456'],
    },
  ];
}
