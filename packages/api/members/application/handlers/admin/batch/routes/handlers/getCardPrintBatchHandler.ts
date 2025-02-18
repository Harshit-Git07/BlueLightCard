import { APIGatewayProxyEvent } from 'aws-lambda';
import { CardPrintBatchModel } from '@blc-mono/shared/models/members/cardPrintBatchModel';

export function isGetCardPrintBatchRoute(event: APIGatewayProxyEvent): boolean {
  return (
    event.httpMethod === 'GET' &&
    event.pathParameters !== null &&
    event.pathParameters.batchId !== undefined &&
    event.path === `/admin/cards/batches/${event.pathParameters.batchId}`
  );
}

export async function getCardPrintBatchHandler(
  // TODO: Implement this and then remove the eslint disable
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  event: APIGatewayProxyEvent,
): Promise<CardPrintBatchModel> {
  // TODO: Actually implement this
  return {
    cardNumbers: ['ABC13456'],
  };
}
