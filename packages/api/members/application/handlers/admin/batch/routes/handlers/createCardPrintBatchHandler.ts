import { APIGatewayProxyEvent } from 'aws-lambda';

export function isCreateCardPrintBatchRoute(event: APIGatewayProxyEvent): boolean {
  return event.httpMethod === 'POST' && event.path === `/admin/cards/batches`;
}

// TODO: Implement this and then remove the eslint disable
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createCardPrintBatchHandler(event: APIGatewayProxyEvent): Promise<void> {
  // TODO: Implement handler
}
